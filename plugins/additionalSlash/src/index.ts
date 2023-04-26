/* 
  Reference
  https://github.com/BreadoWebTech/breadoplugs/blob/master/plugins/quotes
  https://github.com/aeongdesu/vdplugins/blob/main/plugins/Dislate
*/
import { logger } from "@vendetta";
import { registerCommand } from "@vendetta/commands";
// available in vendetta-types, but it crashes
enum ApplicationCommandOptionType {
    SUB_COMMAND = 1,
    SUB_COMMAND_GROUP,
    STRING,
    INTEGER,
    BOOLEAN,
    USER,
    CHANNEL,
    ROLE,
    MENTIONABLE,
    NUMBER,
    ATTACHMENT
}
enum ApplicationCommandInputType {
    BUILT_IN,
    BUILT_IN_TEXT,
    BUILT_IN_INTEGRATION,
    BOT,
    PLACEHOLDER
}
enum ApplicationCommandType {
    CHAT = 1,
    USER,
    MESSAGE
}
let CMD = [];

async function e621(random = true, query, rating = 's') {
  let response;
  
  // rating [ e, q, s ];

  if(random == true) {
    response = await fetch(`https://e621.net/posts.json?tags=rating:${rating}`, { 
      method: 'GET', 
      headers: {
        'User-Agent': 'Floffy-discord-bot/1.0 (by frosty0844 on e621)'
      }
    });
  } 
  else if(random == false) {
    let split = query.split(' ');
    let search = split.join('+');

    response = await fetch(`https://e621.net/posts.json?tags=${search}+rating:${rating}`, { 
      method: 'GET', 
      headers: {
        'User-Agent': 'Floffy-discord-bot/1.0 (by frosty0844 on e621)'
      }
    });
  }
  let data = await response.json();
  let post = await data.posts;
  let urls = post.map(f => f.file.url);
  let bb = urls.filter(a => a);
  let picker = bb[Math.round(Math.random() * bb.length)];
  return picker;
};

function pluginLog(...a) {
  console.log(`[ ANGEL ]`, ...a)
}
const Format = (text: string, regex?: boolean): string => text
    .split(regex ? /(?=[A-Z])/ : "_")
    .map((e: string) => e[0].toUpperCase() + e.slice(1))
    .join(" ")

export const onLoad = () => {
  CMD.push(
    registerCommand({
      name: "e621",
      displayName: "e621",
      description: "generates a e621.",
      displayDescription: "generates a e621",
      options: [
        {
          name: "random",
          displayName: "random",
          description: "generates random snippets",
          displayDescription: "generates random snippets",
          required: true,
          type: ApplicationCommandOptionType.BOOLEAN as number
        },
        {
          name: "query",
          displayName: "query",
          description: "query",
          displayDescription: "query",
          inputType: ApplicationCommandInputType.BUILT_IN_TEXT as number,
          type: ApplicationCommandOptionType.STRING as number
        },
        {
          name: "rating",
          displayName: "rating",
          description: "rating",
          displayDescription: "rating",
          type: ApplicationCommandOptionType.STRING as number,
          choices: [
            {
              name: Format("Explicit"),
              displayName: Format("explicit"),
              value: "e"
            },
            {
              name: Format("Questionable"),
              displayName: Format("questionable"),
              value: "q"
            },
            {
              name: Format("Safe"),
              displayName: Format("safe"),
              value: "s"
            }
          ]
        }
      ],
      type: ApplicationCommandType.CHAT as number,
      applicationId: "",
      inputType: ApplicationCommandInputType.BUILT_IN_TEXT as number,
      execute: async () => {

        const isRandom = args[0].value as boolean
        const isQuery = args[1].value as string
        const isRating = args[2].value as string

        pluginLog(isRandom, isQuery, isRating)

        return { content: 'await e621(true, )'};
      },
    })
  );

}
  


export const onUnload = () => {
    for (const unregisterCommands of CMD) unregisterCommands()
}
