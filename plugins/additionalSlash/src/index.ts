/* 
  Reference
  https://github.com/BreadoWebTech/breadoplugs/blob/master/plugins/quotes/src
*/
import { logger } from "@vendetta";
import { registerCommand } from "@vendetta/commands";
enum ApplicationCommandOptionType {
    SUB_COMMAND = 1,
    SUB_COMMAND_GROUP,
    STRING,
    INTEGER,
    BOOLEAN,
    USER6,
    CHANNEL,
    ROLE,
    MENTIONABLE,
    NUMBER,
    ATTACHMENT
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
          type: ApplicationCommandOptionType.BOOLEAN
        },
        {
          name: "query",
          displayName: "query",
          description: "query",
          displayDescription: "query",
          inputType: ApplicationCommandInputType.BUILT_IN_TEXT as string,
          type: ApplicationCommandOptionType.STRING
        },
        {
          name: "rating",
          displayName: "rating",
          description: "rating",
          displayDescription: "rating",
          type: ApplicationCommandOptionType.STRING,
          choices: [
            {
              name: "Explicit",
              value: "e"
            },
            {
              name: "Questionable",
              value: "q"
            },
            {
              name: "Safe",
              value: "s"
            }
          ]
        }
      ],
      type: 1,
      applicationId: "",
      inputType: ApplicationCommandInputType.BUILT_IN_TEXT as string,
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
