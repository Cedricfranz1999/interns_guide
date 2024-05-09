import Link from "next/link";

import { api } from "~/trpc/server";
import UserTable from "./_components/userTable";

export default async function Home() {
  const getUser = await api.post.getUser();

  return (
    <div>
      <UserTable userData={getUser} />
    </div>
  );
}
