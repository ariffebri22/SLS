"use client";
import { Suspense } from "react";
import ChangePasswordForm from "./changePasswordForm";

export default function ChangePasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ChangePasswordForm />
        </Suspense>
    );
}
