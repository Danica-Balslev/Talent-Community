import { redirect } from "next/navigation";

/** Pretty URL: same experience as the static job matcher page. */
export default function JobMatcherPage() {
  redirect("/job-matcher.html");
}
