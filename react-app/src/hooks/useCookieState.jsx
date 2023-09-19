import { useState } from "react";
import { getCookie } from "../utils/cookieFunctions";

export default function useCookieState(cookieName) {
	return useState(!!getCookie(cookieName));
}
