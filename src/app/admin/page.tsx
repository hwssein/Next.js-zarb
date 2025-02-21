import { redirect } from "next/navigation";
import { Metadata } from "next";

import { GetMusicProps } from "@/types/types";

import sessionRequest from "@/config/sessionRequest";

import createApolloClient from "@/config/apolloClient";
import { Get_Unpublished_Music } from "@/query/musicQuery";

import AdminPage from "@/components/template/AdminPage";

export const metadata: Metadata = {
  title: "ZARBBEAT | Admin",
};

async function Admin() {
  const user = await sessionRequest();

  if (user.error || user.role !== "ADMIN") redirect("/dashboard");

  const client = createApolloClient();
  const { data } = await client.query<GetMusicProps>({
    query: Get_Unpublished_Music,
  });

  if ("musics" in data && data.musics.length > 0) {
    return (
      <>
        <AdminPage musics={data.musics} role={user.role} />
      </>
    );
  } else {
    return (
      <div className="w-full text-center bg-secondary py-4 px-2 rounded-md mt-4 mb-10">
        No Items Found
      </div>
    );
  }
}

export default Admin;
