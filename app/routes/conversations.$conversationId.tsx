import { SentenceType } from "@prisma/client";
import { ActionArgs, LoaderArgs, json, redirect } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useActionData,
  useLoaderData,
  useNavigation,
  useRouteError,
} from "@remix-run/react";
import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import {
  createSentence,
  deleteConversation,
  getConversation,
} from "~/models/conversation.server";
import { requireUserId } from "~/session.server";

import {
  TrashIcon,
  PlusCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.conversationId, "conversationId not found");

  const conversation = await getConversation({ id: params.conversationId });
  if (!conversation) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ conversation });
}

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);
  const conversationId = params.conversationId;
  invariant(conversationId, "conversationId not found");

  const formData = await request.formData();
  const requestType = formData.get("request-type");

  switch (requestType) {
    case "delete-conversation":
      await deleteConversation({ userId, id: conversationId });
      return redirect("/conversations");

    case "add-sentence":
      const typeString = formData.get("type");
      const text = formData.get("sentence");

      if (typeof typeString !== "string" || typeString.length === 0) {
        return json(
          { errors: { type: "Type is required", text: null } },
          { status: 400 }
        );
      }

      if (typeof text !== "string" || text.length === 0) {
        return json(
          { errors: { type: null, text: "Text is required" } },
          { status: 400 }
        );
      }

      let type;
      switch (typeString) {
        case "PersonA":
          type = SentenceType.PersonA;
          break;
        case "PersonB":
          type = SentenceType.PersonB;
          break;
        default:
          type = SentenceType.Description;
          break;
      }

      let response = await createSentence({ type, text, conversationId });

      return redirect(`.`);
  }
}

export default function ConversationDetailsPage() {
  const { conversation } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const addFormRef = useRef<HTMLFormElement>(null);
  const textRef = useRef<HTMLInputElement>(null);
  const navigation = useNavigation();
  const isSubmitting = navigation.state == "submitting";

  useEffect(() => {
    addFormRef.current?.reset();
  }, [actionData]);

  useEffect(() => {
    if (actionData?.errors?.text) {
      textRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div
      style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}
      className="mx-auto max-w-4xl"
    >
      <div className="flex items-center justify-center gap-4 px-2">
        <h1 className="text-xl">
          Level {conversation.level}, Course {conversation.course}, Lesson{" "}
          {conversation.lesson}
        </h1>
        <Form method="post" className="flex flex-col">
          <input
            value="delete-conversation"
            name="request-type"
            readOnly
            hidden
          />
          <button
            type="submit"
            className="self-center rounded text-red-600 hover:text-red-500 disabled:text-gray-600"
            disabled={isSubmitting}
          >
            <TrashIcon className="h-6 w-6" />
          </button>
        </Form>
      </div>
      {conversation.sentences.length > 0 && (
        <main className="mt-4 grid grid-cols-12 gap-y-2 bg-gradient-to-r from-primary-200 to-secondary-200 p-2 sm:rounded-lg sm:border">
          {conversation.sentences.map((c) => {
            switch (c.type) {
              case "PersonA":
                return (
                  <div
                    key={c.id}
                    className="col-start-1 col-end-13 rounded-lg p-1 sm:col-end-8 sm:p-3"
                  >
                    <div className="flex flex-row items-center">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-white">
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
                    className="col-start-1 col-end-13 rounded-lg p-1 sm:col-start-6 sm:p-3"
                  >
                    <div className="flex flex-row-reverse items-center">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-white">
                        B
                      </div>
                      <div className="relative mr-3 rounded-xl bg-primary-100 px-4 py-2 text-sm shadow">
                        <div>{c.text}</div>
                      </div>
                    </div>
                  </div>
                );
              default:
                return (
                  <div
                    key={c.id}
                    className="col-span-12 flex justify-center p-1 text-sm sm:p-3"
                  >
                    <div className="rounded-lg bg-secondary-600 px-6 py-2 text-white">
                      {c.text}
                    </div>
                  </div>
                );
            }
          })}
        </main>
      )}
      <Form method="post" ref={addFormRef}>
        <input value="add-sentence" name="request-type" readOnly hidden />

        <div className="flex flex-row items-center gap-2 p-2 sm:mt-4 sm:p-0">
          <select
            name="type"
            id="type"
            autoComplete="type"
            className="block rounded-md border-0 bg-white text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-5"
          >
            <option value="Description">Description</option>
            <option value="PersonA">Person A</option>
            <option value="PersonB">Person B</option>
          </select>
          <div className="flex-grow">
            <div className="relative">
              <input
                type="text"
                name="sentence"
                id="sentence"
                min={1}
                ref={textRef}
                autoComplete="sentence"
                className="focus:ring-0.5 ring-1shadow-sm block w-full rounded-md border-0 p-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 invalid:ring-red-600 focus:ring-inset sm:text-sm sm:leading-6"
                aria-invalid={actionData?.errors?.text ? true : undefined}
                aria-errormessage={
                  actionData?.errors?.text ? "text-error" : undefined
                }
              />
              {actionData?.errors?.text && (
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <ExclamationCircleIcon
                    className="h-5 w-5 text-red-500"
                    aria-hidden="true"
                  />
                </div>
              )}
              {actionData?.errors?.text && (
                <div
                  className="absolute pt-1 text-sm text-red-700"
                  id="title-error"
                >
                  {actionData.errors.text}
                </div>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="text-primary-600 hover:text-primary-500 disabled:text-gray-600 sm:col-span-2"
            disabled={isSubmitting}
          >
            <PlusCircleIcon className="h-10 w-10" />
          </button>
        </div>
      </Form>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return <div>An unexpected error occurred: {error.message}</div>;
  }

  if (!isRouteErrorResponse(error)) {
    return <h1>Unknown Error</h1>;
  }

  if (error.status === 404) {
    return <div>Conversation not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
