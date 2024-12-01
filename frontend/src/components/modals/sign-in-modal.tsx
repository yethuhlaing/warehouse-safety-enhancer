import {
    Dispatch,
    SetStateAction,
    useCallback,
    useMemo,
    useState,
} from "react";
import { signIn } from "next-auth/react";

import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Icons } from "@/components/shared/icons";
import { env } from "@/env.mjs";

function SignInModal({
    showSignInModal,
    setShowSignInModal,
}: {
    showSignInModal: boolean;
    setShowSignInModal: Dispatch<SetStateAction<boolean>>;
}) {
    const [signInClicked, setSignInClicked] = useState<string | null>(null);

    const handleSignIn = (provider: string) => {
        setSignInClicked(provider);
        signIn(provider, { callbackUrl: env.NEXTAUTH_URL || 'http://localhost:3000' })
            .then(() => {
                setTimeout(() => {
                    setShowSignInModal(false);
                    setSignInClicked(null);
                }, 400);
            })
            .catch((error) => {
                console.error("Sign in error:", error);
                setSignInClicked(null);
            });
    };

    return (
        <Modal showModal={showSignInModal} setShowModal={setShowSignInModal}>
            <div className="w-full">
                <div className="flex flex-col items-center justify-center space-y-3 border-b bg-background px-4 py-6 pt-8 text-center md:px-16">
                    <a href={siteConfig.url}>
                        <Icons.logo className="size-10" />
                    </a>
                    <h3 className="font-urban text-2xl font-bold">Sign In</h3>
                </div>

                <div className="flex flex-col space-y-4 bg-secondary/50 px-4 py-8 md:px-16">
                    <Button
                        variant="default"
                        disabled={signInClicked === "google"}
                        onClick={() => handleSignIn("google")}
                    >
                        {signInClicked === "google" ? (
                            <Icons.spinner className="mr-2 size-4 animate-spin" />
                        ) : (
                            <Icons.google className="mr-2 size-4" />
                        )}{" "}
                        Sign In with Google
                    </Button>
                    <Button
                        variant="default"
                        disabled={signInClicked === "github"}
                        onClick={() => handleSignIn("github")}
                    >
                        {signInClicked === "github" ? (
                            <Icons.spinner className="mr-2 size-4 animate-spin" />
                        ) : (
                            <Icons.gitHub className="mr-2 size-4" />
                        )}{" "}
                        Sign In with Github
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

export function useSignInModal() {
    const [showSignInModal, setShowSignInModal] = useState(false);

    const SignInModalCallback = useCallback(() => {
        return (
            <SignInModal
                showSignInModal={showSignInModal}
                setShowSignInModal={setShowSignInModal}
            />
        );
    }, [showSignInModal, setShowSignInModal]);

    return useMemo(
        () => ({
            setShowSignInModal,
            SignInModal: SignInModalCallback,
        }),
        [setShowSignInModal, SignInModalCallback],
    );
}

