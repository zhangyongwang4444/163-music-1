{
    let view = {}
    let model = {
        data: {
            id: '',
            name: '',
            singer: '',
            url: ''
        },
        get(id) {
            var query = new AV.Query('Song');
            return query.get(id).then((song) => {
                Object.assign(this.data, { id: song.id, ...song.attributes })
                return song
            }, function (error) {
            })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            let id = this.getSongId()
            
            this.model.get(id).then(() => {
                console.log(this.model.data)
            })
        },
        getSongId() {
            let search = window.location.search
            // console.log(search)
            if (search.indexOf('?') === 0) {
                search = search.substring(1)
            }
            // console.log(search)


            let array = search.split('&').filter((v => v)) //过滤数组，如果 v是真值 就要，否则过滤掉
            let id = ''

            for (let i = 0; i < array.length; i++) {
                let kv = array[i].split('=')
                let key = kv[0]
                let value = kv[1]
                if (key === 'id') {
                    id = value
                    break
                }
            }
            return id
        }
    }
    controller.init(view, model)
}

