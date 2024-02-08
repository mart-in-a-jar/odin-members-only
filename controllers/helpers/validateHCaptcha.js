// https://docs.hcaptcha.com/
// can also use library: https://www.npmjs.com/package/hcaptcha

import dotenv from "dotenv/config";

const hCaptchaSecret = process.env.HCAPTCHA_SECRET;
const url = "https://api.hcaptcha.com/siteverify";

const checkToken = async (token) => {
    const formData = new FormData();
    formData.append("response", token);
    formData.append("secret", hCaptchaSecret);
    const res = await fetch(url, { method: "POST", body: formData });
    const resJson = await res.json();
    return resJson;
};

const validateHCaptcha = async (req, res, next) => {
    // pass error if not valid, go to next middleware if valid
    try {
        const hCaptchaResponse = await checkToken(
            req.body["h-captcha-response"]
        );
        if (!hCaptchaResponse.success) {
            const error = new Error(hCaptchaResponse["error-codes"]);
            error.status = 403;
            return next(error);
        }
    } catch (error) {
        return next(error);
    }
    next();
};

export { validateHCaptcha };
