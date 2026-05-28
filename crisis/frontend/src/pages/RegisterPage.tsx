import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as api from "@/services/api";

export function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    role: "VOLUNTEER",
    mobileNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.mobileNumber.length < 10) {
      setError("Mobile number must be at least 10 digits");
      return;
    }

    setLoading(true);

    try {
      await api.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        mobileNumber: formData.mobileNumber,
        role: formData.role,
      } as any);

      navigate("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 to-blue-50">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-red-600 mb-2">🚑 Sentinelos</h1>
          <p className="text-gray-600">Create Your Account</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="mobileNumber">Mobile Number (10+ digits) *</Label>
            <Input
              id="mobileNumber"
              type="tel"
              value={formData.mobileNumber}
              onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="role">Role *</Label>
            <Select value={formData.role} onValueChange={(val) => setFormData({ ...formData, role: val })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VOLUNTEER">👤 Volunteer</SelectItem>
                <SelectItem value="RESCUE_TEAM_LEAD">👨‍💼 Rescue Team Lead</SelectItem>
                <SelectItem value="HOSPITAL_ADMIN">🏥 Hospital Admin</SelectItem>
                <SelectItem value="ADMIN">🔐 System Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm Password *</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            {loading ? "Creating account..." : "Register"}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-red-600 font-semibold hover:underline"
          >
            Login here
          </button>
        </div>
      </Card>
    </div>
  );
}
