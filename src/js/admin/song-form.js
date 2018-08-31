{
    let view = {
        el: '.page > main',
        init() {
            this.$el = $(this.el)
        },
        template: `
            <form class="form">
                <div class="row">
                    <label>
                        歌名
                    </label>
                    <input name="name" type="text" value="__name__">
                </div>
                <div class="row">
                    <label>
                        歌手
                    </label>
                    <input name="singer" type="text" value="__singer__">
                </div>
                <div class="row">
                    <label>
                        外链
                    </label>
                    <input name="url" type="text" value="__url__">
                </div>
                <div class="row">
                    <label>
                        封面
                    </label>
                    <input name="cover" type="text" value="__cover__">
                </div>
                <div class="row">
                    <label>
                        歌词
                    </label>
                    <textarea cols="100" rows="10" name="lyrics">__lyrics__</textarea>
                </div>
                <div class="row actions">
                    <button type="submit">保存</button>
                </div>
            </form>
        `,
        render(data = {}) {
            let placeholders = ['name', 'singer', 'url', 'id', 'cover','lyrics']
            let html = this.template
            placeholders.map((string) => {
                html = html.replace(`__${string}__`, data[string] || '')
            })
            $(this.el).html(html)
            if (data.id) {
                $(this.el).prepend('<h1>编辑歌曲</h1>')
            } else {
                $(this.el).prepend('<h1>新建歌曲</h1>')
            }
        },
        reset() {
            this.render({})
        }
    }


    let model = {
        data: { name: '', singer: '', url: '', id: '', cover: '',lyrics:'' },
        update(data) {
            var song = AV.Object.createWithoutData('Song', this.data.id)
            song.set('name', this.data.name)
            song.set('singer', this.data.singer)
            song.set('lyrics',this.data.lyrics)
            song.set('url', this.data.url)
            song.set('cover', this.data.cover)
            console.dir(song)
            return song.save().then((response) => {
                Object.assign(this.data, data)
                return response
            })
        },
        create(data) {
            // 声明类型
            var Song = AV.Object.extend('Song');
            // 新建对象
            var song = new Song();
            // 设置名称
            song.set('name', data.name);
            song.set('singer', data.singer);
            song.set('lyrics',data.lyrics)
            song.set('url', data.url);
            song.set('cover', data.cover);
            // 设置优先级
            // song.set('priority', 1);
            return song.save().then((newSong) => {
                let { id, attributes } = newSong
                // this.data = {
                //     id,
                //     ...attributes
                // }
                // this.data.id = id
                // this.data.name = attributes.name
                // this.data.singer = attributes.singer
                // this.data.url = attributes.url

                Object.assign(this.data, {
                    id,
                    ...attributes,
                    // name:attributes.name,
                    // singer:attributes.singer,
                    // url:attributes.url
                })

                console.log(newSong);
            }, (error) => {
                console.error(error);
            });
        }
    }

    let controller = {
        init(view, model) {
            this.view = view
            this.view.init()
            this.model = model
            this.view.render(this.model.data)
            this.bindEvents()

            window.eventHub.on('select', (data) => {
                console.log('song form 知道了用户选了')
                console.log(data)
                this.model.data = data
                this.view.render(this.model.data)
            })
            window.eventHub.on('new', (data) => {
                if (this.model.data.id) {
                    this.model.data = { name: '', url: '', id: '', singer: '',lyrics:'' }
                } else {
                    Object.assign(this.model.data, data)
                }
                this.view.render(this.model.data)
            })
        },
        reset(data) {
            this.view.render(data)
        },
        create() {
            let needs = 'name singer url cover'.split(' ')
            let data = {}
            needs.map((string) => {
                data[string] = this.view.$el.find(`[name="${string}"]`).val()
            })
            this.model.create(data)
                .then(() => {
                    console.log(this.model.data)
                    this.view.reset()
                    let string = JSON.stringify(this.model.data)   //深拷贝
                    let object = JSON.parse(string)                //深拷贝
                    window.eventHub.emit('create', object)
                })
        },
        update() {
            let needs = 'name singer url cover lyrics'.split(' ')
            let data = {}
            needs.map((string) => {
                data[string] = this.view.$el.find(`[name="${string}"]`).val()
            })
            this.model.update(data)
                .then(() => {
                    window.eventHub.emit('update', JSON.parse(JSON.stringify(this.model.data))) //深拷贝
                })
        },
        bindEvents() {
            this.view.$el.on('submit', 'form', (e) => {
                e.preventDefault()
                if (this.model.data.id) {
                    console.log('id 存在')
                    this.update()
                } else {
                    console.log('id 不存在')
                    this.create()
                }
                return
            })
        }
    }
    controller.init(view, model)

    // window.app.songForm = controller
}