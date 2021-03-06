var nest = require('depnest')
var { h, computed, map, send } = require('mutant')

exports.gives = nest('message.html.meta')
exports.needs = nest({
  'message.obs.likes': 'first',
  'message.sheet.likes': 'first',
  'about.obs.name': 'first',
  'intl.sync.i18n': 'first',
})

exports.create = function (api) {
  const i18n = api.intl.sync.i18n
  return nest('message.html.meta', function likes (msg) {
    if (msg.key) {
      return computed(api.message.obs.likes(msg.key), likeCount)
    }
  })

  function likeCount (likes) {
    if (likes.length) {
      return [' ', h('a.likes', {
        title: names(likes),
        href: '#',
        'ev-click': send(api.message.sheet.likes, likes)
      }, [`${likes.length} ${likes.length === 1 ? i18n('like') : i18n('likes')}`])]
    }
  }

  function names (ids) {
    var items = map(ids, api.about.obs.name)
    return computed([items], (names) => {
      return i18n('Liked by\n') + names.map((n) => `- ${n}`).join('\n')
    })
  }
}
