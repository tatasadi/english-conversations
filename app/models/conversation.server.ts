type Conversation = {
  level: string;
  course: string;
  lesson: string;
  sentences: Array<Sentence>;
};

type Sentence = {
  id: string;
  order: string;
  type: string;
  text: string;
};

export async function getConversations(): Promise<Array<Conversation>> {
  return [
    {
      level: "A1",
      course: "2",
      lesson: "14",
      sentences: [
        {
          id: "1",
          order: "1",
          type: "Description",
          text: "Es ist beinah an der Zeit für einen großen Sport-Wettkamp. Ren und Aida versuchen, online Tickets zu bekommen...",
        },
        {
          id: "2",
          order: "2",
          type: "PersonA",
          text: "What do you want to see, Aida? Do you like swimming?",
        },
        {
          id: "3",
          order: "3",
          type: "PersonB",
          text: "Yes, I love swimming. It's my favorite sport.",
        },
        {
          id: "4",
          order: "4",
          type: "PersonA",
          text: "Great, me too!",
        },
        {
          id: "5",
          order: "5",
          type: "Description",
          text: "Ren versucht, Tickets für Schwimmen zu bekommen, aber sie sind schon alle weg...",
        },
        {
          id: "6",
          order: "6",
          type: "PersonB",
          text: "Oh no! We can't watch swimming. Do you like basketball?",
        },
        {
          id: "7",
          order: "7",
          type: "PersonA",
          text: "Umm, no, I don't like basketball.",
        },
        {
          id: "8",
          order: "8",
          type: "PersonB",
          text: "Do you like watching tennis?",
        },
        {
          id: "9",
          order: "9",
          type: "PersonA",
          text: "Yes, I like watching tennis.",
        },
        {
          id: "10",
          order: "10",
          type: "Description",
          text: "Die beiden versuchen, Tickets für Tennis zu reservieren...",
        },
        {
          id: "11",
          order: "11",
          type: "PersonB",
          text: "We got the last two tickets!",
        },
        {
          id: "12",
          order: "12",
          type: "PersonA",
          text: "Yes, I'm so excited!",
        },
      ],
    },
  ];
}
