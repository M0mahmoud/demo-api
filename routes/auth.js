const { Router } = require("express");
const { signIn, signUp, verifyOTP } = require("../controller/auth");

const router = Router();

router.post("/signin", signIn);
router.post("/signup", signUp);
router.post("/verify-otp", verifyOTP);

module.exports = router;
