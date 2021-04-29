// ивенты
document.querySelector('#btnRandom').addEventListener('click', (e)=>{ //при клике на кнопку создаем фейк пользователя
  User.loadId()
  const user = new User(User.userRandom(7), User.userRandom(10))
  Storage._users.push(user)
  console.log(Storage._users)
  user.createProfile(faker.phone.phoneNumber(), faker.name.findName(), this.username)
  user.createSocials(`https://vk.com/id${Math.floor(Math.random() * 1000000)}`, `https://facebook.com/profile.php?id=${Math.floor(Math.random() * 1000000)}`)
  User.idUser++

  User.saveId()

  Storage.save()
  UI.render()
})

// Класс Пользователь

class User{
  static idUser;

  static saveId(){
    localStorage.setItem('UserLastId', JSON.stringify(User.idUser))
  }

  static loadId(){
    if (User.idUser !== null){
      User.idUser = JSON.parse(localStorage.getItem('UserLastId'))
    }else{
      User.idUser = 0;
    }
  }

  constructor(username, password) {
    this.id = User.idUser
    this.username = username
    this.password = password
    this.regDate = moment().format('DD/MM/YYYY');
    this.isBanned = {
      banned: false
    }
  }

  createProfile(phone, fullname, username){ // метод создания профиля пользователя
    Profile.loadId()
    const profile = new Profile(phone, fullname, username, this.id)
    Storage._profiles.push(profile)
    Profile.idProfile++

    Profile.saveId()

    Storage.save()
  }

  createSocials(vk, fb){ // метод создания социалок пользователя (?)
    Social.loadId()
    const social = new Social(vk, fb, this.id)
    Storage._socials.push(social)
    Social.idSocial++

    Social.saveId()

    Storage.save()
  }

  ban(reason){ // метод блокировки пользователя
    this.isBanned.reason = `${reason}`
    this.isBanned.banned = !this.isBanned.banned

    Storage.save()
  }

  get profileName(){ // получение полного имени (Это я просто чутка баловался)
    let fullName = Storage._profiles[this.id - 1].fullname
    return `Имя пользователя - ${fullName}`
  }

  get socialLinks(){ // вывод социалок (Это я тоже просто баловался)
    let vk = Storage._socials[this.id - 1].vk
    let fb = Storage._socials[this.id - 1].fb
    return `Вконтакте - ${vk}. Фейсбук - ${fb}`
  }

  static userRandom(l){ // рандомайзер буковок (l - длина), чтоб имитировать логин юзера
    let result           = [];
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < l; i++) {
      result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
  }
}

// Класс Профиль

class Profile{
  constructor(phone, fullname, username, user_id) {
    this.id = Profile.idProfile
    this.username = username
    this.phone = phone
    this.fullname = fullname
    this.user_id = user_id
  }

  static idProfile; // Считаем айдишники

  static saveId(){ // сохраняем значение айдишника в хранилище
    localStorage.setItem('ProfileLastId', JSON.stringify(Profile.idProfile))
  }

  static loadId(){
    if (Profile.idProfile !== null){
      Profile.idProfile = JSON.parse(localStorage.getItem('ProfileLastId'))
    }else{
      Profile.idProfile = 0;
    }
  }
}

// Класс Сети

class Social {
  constructor(vk, fb, user_id) {
    this.id = Social.idSocial
    this.vk = vk
    this.fb = fb
    this.regDate = moment().format('DD/MM/YYYY');
    this.user_id = user_id
  }

  static idSocial; // Считаем айдишники

  static saveId(){ // сохраняем значение айдишника в хранилище
    localStorage.setItem('SocialLastId', JSON.stringify(Social.idSocial))
  }

  static loadId(){
    if (Social.idSocial !== null){
      Social.idSocial = JSON.parse(localStorage.getItem('SocialLastId'))
    }else{
      Social.idSocial = 0;
    }
  }
}

//UI

class UI {
  static render(){
    const list = document.querySelector('#user-list');
    list.innerHTML ='';
    for (let i = 0; i < Storage._users.length; i++){
      const tr = document.createElement('tr');

      tr.innerHTML = `
      <td class="item-username">${Storage._users[i].username}</td>
      <td><a href="#" class="item-profile">${Storage._profiles[i].fullname}</a></td>
      <td class="item-social"><a href="${Storage._socials[i].vk}"><i class="fab fa-vk"></i></a> <a href="${Storage._socials[i].fb}"><i class="fab fa-facebook-f"></i></a></td>
      <td><a class="btn btn-danger btnDelete">Пока для красоты</a></td>
      `;
      list.append(tr)

      // накидываю слушателей на ссылки профиля
      let allProfiles = document.querySelectorAll('.item-profile')
      allProfiles[i].addEventListener('click', ()=>{
        Storage._profiles.forEach((profile, index) =>{
          if(profile.user_id === Storage._users[i].id){
            console.log(profile) // вывод профилей, которые относятся к данному пользователю. Надо было делать не профили, а типа сообщения. А то совсем чет странное получается :D
          }
        })
      })
    }
    User.loadId()
    Profile.loadId()
    Social.loadId()
  }
}

// localStorage

class Storage {
  static _users = []
  static _profiles = []
  static _socials = []

  static save(){ //сохранение в хранилище
    let users = localStorage.setItem('Users', JSON.stringify(Storage._users))
    let profiles = localStorage.setItem('Profiles', JSON.stringify(Storage._profiles))
    let socials = localStorage.setItem('Socials', JSON.stringify(Storage._socials))
  }

  static load(){ // загрузка из хранилища
    let users = []
    let profiles = []
    let socials = []

    users = JSON.parse(localStorage.getItem('Users'))
    profiles = JSON.parse(localStorage.getItem('Profiles'))
    socials = JSON.parse(localStorage.getItem('Socials'))

    // Обходим массивы, присваиваем классы объектам

    users.forEach((e, i) =>{
      Storage._users.push(Object.assign(new User(e.username, e.password), Storage._users[i]))
      Storage._users[i].id = i
    })

    profiles.forEach((e, i) =>{
      Storage._profiles.push(Object.assign(new Profile(e.phone, e.fullname, e.username, e.user_id), Storage._profiles[i]))
      Storage._profiles[i].id = i
    })

    socials.forEach((e, i) =>{
      Storage._socials.push(Object.assign(new Social(e.vk, e.fb, e.user_id), Storage._socials[i]))
      Storage._socials[i].id = i
    })
  }
}

User.loadId()
Profile.loadId()
Social.loadId()

Storage.load()
UI.render()