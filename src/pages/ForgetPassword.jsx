import React, { useState } from "react";
import EmailEntry from "../components/EmailEntry";
import OtpVerification from "../components/OTPVerification";
import ChangePassword from "../components/ChangePassword";
const ForgetPassword = () => {
  const [step, setStep] = useState(1);

  return (
    <>
      {step === 1 && <EmailEntry setStep={setStep} />}
      {step === 2 && <OtpVerification setStep={setStep} />}
      {step === 3 && <ChangePassword setStep={setStep} />}
    </>
  );
};

export default ForgetPassword;
