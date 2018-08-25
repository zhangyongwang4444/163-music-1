{
    console.log(window.AV)
    //项目初始化
    let APP_ID = '4NMUtmslXR6DWLj9CjdwLJ1b-gzGzoHsz';
    let APP_KEY = 'caPKKYOFqskCK3hChOoJkdmC';

    AV.init({
        appId: APP_ID,
        appKey: APP_KEY
    });

    // //创建数据库
    // var TestObject = AV.Object.extend('Playlist');
    // //创建一条记录
    // var testObject = new TestObject();
    // //保存记录
    // testObject.save({
    //     name:'test',
    //     cover:'test',
    //     creatorId:'test',
    //     description:'test',
    //     songs:['1','2']
    // }).then(function (object) {
    //     alert('LeanCloud Rocks!');
    // },()=>{alert('fuck')})
}
