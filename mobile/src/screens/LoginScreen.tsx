import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { colors, spacing, fontSize, borderRadius } from "../lib/theme";
import { auth } from "../lib/api";

interface LoginScreenProps {
  onLogin: (token: string) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<"player" | "organizer">("player");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }
    if (!isLogin && !username.trim()) {
      setError("Please enter a username");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let res;
      if (isLogin) {
        res = await auth.login(email.trim(), password);
      } else {
        res = await auth.register(email.trim(), username.trim(), password, role);
      }
      onLogin(res.token);
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>VersaPlay</Text>
          <Text style={styles.subtitle}>
            The ultimate multi-sport tournament platform
          </Text>
        </View>

        {/* Toggle */}
        <View style={styles.toggle}>
          <TouchableOpacity
            style={[styles.toggleBtn, isLogin && styles.toggleActive]}
            onPress={() => setIsLogin(true)}
          >
            <Text
              style={[
                styles.toggleText,
                isLogin && styles.toggleTextActive,
              ]}
            >
              Sign In
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, !isLogin && styles.toggleActive]}
            onPress={() => setIsLogin(false)}
          >
            <Text
              style={[
                styles.toggleText,
                !isLogin && styles.toggleTextActive,
              ]}
            >
              Register
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.heading}>
          {isLogin ? "Welcome back" : "Create your account"}
        </Text>
        <Text style={styles.desc}>
          {isLogin
            ? "Sign in to access your dashboard"
            : "Join the community of athletes and organizers"}
        </Text>

        {/* Google Auth */}
        <TouchableOpacity style={styles.googleBtn}>
          <Text style={styles.googleText}>
            Sign {isLogin ? "in" : "up"} with Google
          </Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Form */}
        {!isLogin && (
          <View style={styles.field}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your username"
              placeholderTextColor={colors.textMuted}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>
        )}

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor={colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {/* Role Toggle */}
        {!isLogin && (
          <View style={styles.field}>
            <Text style={styles.label}>Register as</Text>
            <View style={styles.roleRow}>
              <TouchableOpacity
                style={[
                  styles.roleBtn,
                  role === "player" && styles.roleBtnActive,
                ]}
                onPress={() => setRole("player")}
              >
                <Text
                  style={[
                    styles.roleText,
                    role === "player" && styles.roleTextActive,
                  ]}
                >
                  Player
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.roleBtn,
                  role === "organizer" && styles.roleBtnActive,
                ]}
                onPress={() => setRole("organizer")}
              >
                <Text
                  style={[
                    styles.roleText,
                    role === "organizer" && styles.roleTextActive,
                  ]}
                >
                  Organizer
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {isLogin && (
          <TouchableOpacity style={styles.forgotRow}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={[styles.submitBtn, loading && { opacity: 0.7 }]} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={colors.dark} />
          ) : (
            <Text style={styles.submitText}>
              {isLogin ? "Sign In" : "Create Account"}
            </Text>
          )}
        </TouchableOpacity>

        <View style={styles.switchRow}>
          <Text style={styles.switchText}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
          </Text>
          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.switchLink}>
              {isLogin ? "Create one" : "Sign in"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: 80,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: spacing.xxxl,
  },
  logo: {
    fontSize: 36,
    fontWeight: "900",
    fontStyle: "italic",
    color: colors.lime,
  },
  subtitle: {
    fontSize: fontSize.base,
    color: colors.textDim,
    marginTop: spacing.sm,
  },
  toggle: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: 4,
    marginBottom: spacing.xxl,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: borderRadius.md,
  },
  toggleActive: {
    backgroundColor: colors.lime,
  },
  toggleText: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.textDim,
  },
  toggleTextActive: {
    color: colors.dark,
  },
  heading: {
    fontSize: fontSize.xxl,
    fontWeight: "700",
    color: colors.white,
    marginBottom: spacing.sm,
  },
  desc: {
    fontSize: fontSize.sm,
    color: colors.textDim,
    marginBottom: spacing.xxl,
  },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingVertical: 14,
    marginBottom: spacing.lg,
  },
  googleText: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.white,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginHorizontal: spacing.lg,
  },
  field: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.xs,
    fontWeight: "500",
    color: colors.textDim,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    fontSize: fontSize.sm,
    color: colors.white,
  },
  roleRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  roleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  roleBtnActive: {
    borderColor: colors.lime,
    backgroundColor: "rgba(200, 255, 0, 0.1)",
  },
  roleText: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.textDim,
  },
  roleTextActive: {
    color: colors.lime,
  },
  forgotRow: {
    alignItems: "flex-end",
    marginBottom: spacing.lg,
  },
  forgotText: {
    fontSize: fontSize.xs,
    color: colors.lime,
  },
  submitBtn: {
    backgroundColor: colors.lime,
    borderRadius: borderRadius.lg,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  submitText: {
    fontSize: fontSize.base,
    fontWeight: "700",
    color: colors.dark,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.xl,
  },
  switchText: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  switchLink: {
    fontSize: fontSize.xs,
    color: colors.lime,
  },
  errorBox: {
    backgroundColor: "rgba(239,68,68,0.1)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.3)",
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  errorText: {
    fontSize: fontSize.xs,
    color: colors.red,
    textAlign: "center",
  },
});
