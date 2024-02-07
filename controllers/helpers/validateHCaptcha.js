// https://docs.hcaptcha.com/
// can also use library: https://www.npmjs.com/package/hcaptcha

import dotenv from "dotenv/config";

const hCaptchaSecret = process.env.HCAPTCHA_SECRET;
const url = "https://api.hcaptcha.com/siteverify";

const validate = async (token) => {

    const formData = new FormData();
    formData.append("response", token);
    formData.append("secret", hCaptchaSecret);
    const res = await fetch(url, { method: "POST", body: formData });
    const resJson = await res.json();
    return resJson;
};

export { validate };
