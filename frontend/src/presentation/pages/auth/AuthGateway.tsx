import AuthForm from "../../components/auth/AuthForm";

interface AuthGatewayProps {
    mode: "login" | "signup";
}

const AuthGateway = ({ mode }: AuthGatewayProps) => {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <AuthForm mode={mode} />
        </div>
    );
};

export default AuthGateway;