const SearchCommand = require('../../structures/command/SearchCommand.js')
const { SwitchbladeEmbed, CommandStructures, Constants } = require('../../')
const { CommandRequirements, CommandParameters, StringParameter, BooleanFlagParameter } = CommandStructures

module.exports = class YouTube extends SearchCommand {
  constructor (client) {
    super(client)

    this.name = 'youtube'
    this.aliases = ['yt']
    this.embedColor = Constants.YOUTUBE_COLOR
    this.embedLogoURL = 'https://i.imgur.com/yQy45qO.png'

    this.requirements = new CommandRequirements(this, { apis: ['youtube'] })
    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, required: true, missingError: 'commons:search.noParams' }),
      [
        new BooleanFlagParameter({ name: 'video', aliases: [ 'v', 'videos' ] }),
        new BooleanFlagParameter({ name: 'channel', aliases: [ 'c', 'channels' ] }),
        new BooleanFlagParameter({ name: 'playlist', aliases: [ 'p', 'playlists' ] }),
        new StringParameter({ name: 'order', aliases: 'o', full: false, required: false, whitelist: ['date', 'rating', 'relevance', 'title', 'videoCount', 'viewCount'] })
      ]
    )
  }

  async search (context, query) {
    const { flags } = context
    const types = Object.keys(flags).filter(f => ['video', 'channel', 'playlist'].includes(f))
    const res = await this.client.apis.youtube.search(query, types, 'snippet,id', flags.order || 'relevance', 10)
    return res.items
  }

  searchResultFormatter ({ id, snippet }) {
    const { title } = snippet
    const type = this.getType(id)
    return `\`${type === 'video' ? 'V' : type === 'channel' ? 'C' : 'P'}\` ${title}`
  }

  async handleResult ({ t, channel, author, language }, aa) {
    // TODO
  }

  static getType ({ kind }) {
    return kind.split('#')[1]
  }
}
