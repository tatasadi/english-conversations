import { json } from "@remix-run/node";
import { useLoaderData, V2_MetaFunction } from "@remix-run/react";
import { getConversations } from "~/models/conversation.server";

export const meta: V2_MetaFunction = () => {
  return [{ title: "English Conversations" }];
};

export const loader = async () => {
  return json({ conversations: await getConversations() });
};

export default function ConversationsPage() {
  const { conversations } = useLoaderData<typeof loader>();
  const conversation = conversations[0];
  return (
    <div
      style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}
      className="mx-auto max-w-4xl p-4"
    >
      <h1 className="text-center text-xl">
        Level {conversation.level}, Course {conversation.course}, Lesson{" "}
        {conversation.lesson}
      </h1>
      <main className="mt-4 grid grid-cols-12 gap-y-2 rounded-lg border bg-gray-100 p-4">
        {conversation.sentences.map((c) => {
          switch (c.type) {
            case "PersonA":
              return (
                <div
                  key={c.id}
                  className="col-start-1 col-end-13 rounded-lg p-3 sm:col-end-8"
                >
                  <div className="flex flex-row items-center">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500">
                      A
                    </div>
                    <div className="relative ml-3 rounded-xl bg-white px-4 py-2 text-sm shadow">
                      <div>{c.text}</div>
                    </div>
                  </div>
                </div>
              );
            case "PersonB":
              return (
                <div
                  key={c.id}
                  className="col-start-1 col-end-13 rounded-lg p-3 sm:col-start-6"
                >
                  <div className="flex flex-row-reverse items-center">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500">
                      B
                    </div>
                    <div className="relative mr-3 rounded-xl bg-indigo-100 px-4 py-2 text-sm shadow">
                      <div>{c.text}</div>
                    </div>
                  </div>
                </div>
              );
            default:
              return (
                <div
                  key={c.id}
                  className="col-span-12 flex justify-center text-sm"
                >
                  <div className="rounded-lg bg-gray-300 px-6 py-2">
                    {c.text}
                  </div>
                </div>
              );
          }
        })}
      </main>
    </div>
  );
}
