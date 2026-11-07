package com.example.sentinelos.service;

import com.example.sentinelos.dto.EmergencyRequest;
import com.example.sentinelos.dto.RescueMissionRequest;
import com.example.sentinelos.dto.TriageRequest;
import com.example.sentinelos.entity.AmbulanceUnit;
import com.example.sentinelos.entity.Emergency;
import com.example.sentinelos.entity.Hospital;
import com.example.sentinelos.entity.RescueMission;
import com.example.sentinelos.repository.AmbulanceUnitRepository;
import com.example.sentinelos.repository.EmergencyRepository;
import com.example.sentinelos.repository.HospitalRepository;
import com.example.sentinelos.repository.RescueMissionRepository;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;
import java.util.function.BiFunction;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
class EmergencyWorkflowTest {
    @Test
    void reportIsTriagedMatchedAcceptedAndTrackedThroughCompletion() {
        AtomicReference<Emergency> storedEmergency = new AtomicReference<>();
        AtomicReference<RescueMission> storedMission = new AtomicReference<>();
        AtomicReference<AmbulanceUnit> storedAmbulance = new AtomicReference<>();
        EmergencyRepository emergencyRepository = fakeRepository(EmergencyRepository.class, (method, args) -> switch (method.getName()) {
            case "save" -> { Emergency value = (Emergency) args[0]; value.setId("incident-test-1"); storedEmergency.set(value); yield value; }
            case "findById" -> Optional.ofNullable(storedEmergency.get());
            default -> defaultValue(method.getReturnType());
        });
        LocalDateTime now = LocalDateTime.now();
        Hospital suitableHospital = Hospital.builder().id("hospital-suitable").name("Test Trauma Hospital")
                .status("ACTIVE").services(List.of("TRAUMA")).bedsAvailable(2).icuAvailable(0).cardiacBedsAvailable(0)
                .latitude(17.39).longitude(78.49).capacityUpdatedAt(now).updatedAt(now).build();
        Hospital unsuitableHospital = Hospital.builder().id("hospital-unsuitable").name("Test Hospital Without Trauma")
                .status("ACTIVE").services(List.of("PEDIATRIC")).bedsAvailable(5)
                .latitude(17.3851).longitude(78.4861).capacityUpdatedAt(now).build();
        HospitalRepository hospitalRepository = fakeRepository(HospitalRepository.class, (method, args) ->
                method.getName().equals("findAll") ? List.of(unsuitableHospital, suitableHospital) : defaultValue(method.getReturnType()));
        AmbulanceUnit suitableAmbulance = AmbulanceUnit.builder().id("ambulance-suitable").callSign("TEST-TRAUMA-1")
                .type("BASIC").capabilities(List.of("TRAUMA")).status("AVAILABLE")
                .latitude(17.386).longitude(78.487).locationUpdatedAt(now).updatedAt(now).build();
        AmbulanceUnit unsuitableAmbulance = AmbulanceUnit.builder().id("ambulance-unsuitable").callSign("TEST-BASIC-2")
                .type("BASIC").capabilities(List.of("BASIC")).status("AVAILABLE")
                .latitude(17.3851).longitude(78.4861).locationUpdatedAt(now).updatedAt(now).build();
        storedAmbulance.set(suitableAmbulance);
        AmbulanceUnitRepository ambulanceRepository = fakeRepository(AmbulanceUnitRepository.class, (method, args) -> switch (method.getName()) {
            case "findByStatus" -> List.of(unsuitableAmbulance, suitableAmbulance);
            case "findById" -> "ambulance-suitable".equals(args[0]) ? Optional.of(suitableAmbulance) : Optional.empty();
            case "save" -> { storedAmbulance.set((AmbulanceUnit) args[0]); yield args[0]; }
            default -> defaultValue(method.getReturnType());
        });
        RescueMissionRepository rescueMissionRepository = fakeRepository(RescueMissionRepository.class, (method, args) -> switch (method.getName()) {
            case "save" -> { RescueMission value = (RescueMission) args[0]; if (value.getId() == null) value.setId("mission-test-1"); storedMission.set(value); yield value; }
            case "findById" -> Optional.ofNullable(storedMission.get());
            case "findByEmergencyId" -> storedMission.get() == null ? List.of() : List.of(storedMission.get());
            default -> defaultValue(method.getReturnType());
        });

        EmergencyService emergencyService = new EmergencyService(emergencyRepository);
        ResourceMatchingService matchingService = new ResourceMatchingService(
                emergencyRepository, hospitalRepository, ambulanceRepository);
        RescueMissionService missionService = new RescueMissionService(
                rescueMissionRepository, emergencyRepository, ambulanceRepository, matchingService);

        EmergencyRequest reportRequest = EmergencyRequest.builder()
                .fullName("Workflow Test")
                .mobileNumber("9999999999")
                .emergencyType("ACCIDENT")
                .description("Synthetic workflow test report")
                .latitude(17.385)
                .longitude(78.486)
                .victims(1)
                .hasMedicalEmergency(true)
                .build();
        var report = emergencyService.reportEmergency("workflow-test@example.invalid", "workflow-test@example.invalid", reportRequest);
        assertEquals("REPORTED", report.getStatus());

        TriageRequest triage = new TriageRequest();
        triage.setPriority("CRITICAL");
        triage.setRequiredServices(List.of("TRAUMA"));
        triage.setRequiredBedType("GENERAL");
        triage.setNeedsAmbulance(true);
        triage.setAmbulanceCapability("TRAUMA");
        triage.setNotes("Synthetic triage for automated workflow test");
        assertEquals("TRIAGED", emergencyService.triageEmergency(report.getId(), triage, "dispatcher-test").getStatus());

        var recommendations = matchingService.recommend(report.getId());
        assertEquals(List.of("hospital-suitable"), recommendations.getHospitals().stream().map(h -> h.getId()).toList());
        assertEquals(List.of("ambulance-suitable"), recommendations.getAmbulances().stream().map(a -> a.getId()).toList());

        RescueMissionRequest dispatch = RescueMissionRequest.builder()
                .emergencyId(report.getId())
                .hospitalId("hospital-suitable")
                .ambulanceId("ambulance-suitable")
                .build();
        var offer = missionService.createMission(dispatch);
        assertEquals("OFFERED", offer.getStatus());
        assertFalse(Boolean.TRUE.equals(offer.getTeamAccepted()));
        assertFalse(Boolean.TRUE.equals(offer.getHospitalAccepted()));

        assertEquals("OFFERED", missionService.recordAcceptance("mission-test-1", "TEAM", true, "team-test").getStatus());
        assertEquals("ACCEPTED", missionService.recordAcceptance("mission-test-1", "HOSPITAL", true, "hospital-test").getStatus());
        assertEquals("DISPATCHED", storedEmergency.get().getStatus());

        missionService.updateMissionStatus("mission-test-1", "EN_ROUTE");
        missionService.updateMissionStatus("mission-test-1", "REACHED");
        assertEquals("ON_SCENE", storedEmergency.get().getStatus());
        missionService.updateMissionStatus("mission-test-1", "TRANSPORTING");
        missionService.updateMissionStatus("mission-test-1", "ARRIVED");
        missionService.updateMissionStatus("mission-test-1", "COMPLETED");

        assertEquals("RESOLVED", storedEmergency.get().getStatus());
        assertEquals("AVAILABLE", suitableAmbulance.getStatus());
        assertEquals(List.of("REPORTED", "TRIAGED", "DISPATCHED", "ON_SCENE", "TRANSPORTING", "ARRIVED", "RESOLVED"),
                storedEmergency.get().getStatusHistory().stream().map(event -> event.getStatus()).toList());
        assertTrue(storedMission.get().getTeamAccepted());
        assertTrue(storedMission.get().getHospitalAccepted());
    }

    private static <T> T fakeRepository(Class<T> type, BiFunction<Method, Object[], Object> handler) {
        return type.cast(Proxy.newProxyInstance(type.getClassLoader(), new Class<?>[]{type}, (proxy, method, args) -> {
            if (method.getDeclaringClass() == Object.class) {
                return switch (method.getName()) {
                    case "toString" -> "Fake " + type.getSimpleName();
                    case "hashCode" -> System.identityHashCode(proxy);
                    case "equals" -> proxy == args[0];
                    default -> null;
                };
            }
            return handler.apply(method, args == null ? new Object[0] : args);
        }));
    }

    private static Object defaultValue(Class<?> returnType) {
        if (returnType == Optional.class) return Optional.empty();
        if (returnType == List.class) return List.of();
        if (returnType == long.class) return 0L;
        if (returnType == int.class) return 0;
        if (returnType == boolean.class) return false;
        return null;
    }
}
