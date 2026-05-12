import { getCurrentProfile } from "@/lib/auth/session";
import { NavbarClient } from "./navbar-client";

export async function Navbar() {
  const profile = await getCurrentProfile();
  return <NavbarClient profile={profile} />;
}
