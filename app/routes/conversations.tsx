import { json, LoaderArgs } from "@remix-run/node";
import {
  Form,
  Link,
  NavLink,
  Outlet,
  useLoaderData,
  useNavigate,
  V2_MetaFunction,
} from "@remix-run/react";
import { ChangeEvent, useState } from "react";
import { getConversationListItems } from "~/models/conversation.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Save Conversations" }];
};

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  const conversationListItems = await getConversationListItems({ userId });
  return json({ conversationListItems });
};

export default function ConversationsPage() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();
  const navigate = useNavigate();
  const [selectValue, setSelectedValue] = useState("none");

  function handleSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    const conversationId = event.target.value;
    setSelectedValue(conversationId);
    navigate(`./${conversationId}`);
  }

  return (
    <div className="flex flex-col">
      <header className="flex flex-col items-center justify-between gap-2 bg-slate-800 p-4 text-white sm:flex-row">
        <h1 className="text-3xl font-bold">
          <Link to=".">Conversations</Link>
        </h1>
        <p>{user.email}</p>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
      </header>

      <main className="flex h-full flex-col bg-white">
        <div className="flex h-full w-full flex-col items-center gap-1 border-r p-4 sm:flex-row">
          <Link
            to="new"
            className="block rounded bg-indigo-600 p-2 text-xl text-white"
          >
            + New Conversation
          </Link>

          <hr />
          {data.conversationListItems.length === 0 ? (
            <p className="p-4">No conversations yet</p>
          ) : (
            <select
              className="rounded border-2 bg-white p-2"
              value={selectValue}
              onChange={handleSelectChange}
            >
              <option value="none">---Select a lesson---</option>
              {data.conversationListItems.map((conversation) => (
                <option key={conversation.id} value={conversation.id}>
                  {conversation.level}-{conversation.course}-
                  {conversation.lesson}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="mb-auto sm:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
