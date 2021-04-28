// глобальные переменные

let _id = 0
let _users = []
let _profiles = []
let _socials = []

// ивенты

document.querySelector('#btnRandom').addEventListener('click', (e)=>{
  User.userIdCount()
  const user = new User(_users.length, User.userRandom(7), User.userRandom(10))
  _users.push(user)
  user.createProfile(faker.phone.phoneNumber(), faker.name.findName())
  user.createSocials(`https://vk.com/id${Math.floor(Math.random() * 1000000)}`, `https://facebook.com/profile.php?id=${Math.floor(Math.random() * 1000000)}`)
  console.log(_users)
  UI.render()
})

// Класс Пользователь

class User{
  constructor(id, username, password) {
    this.id = id
    this.username = username
    this.password = password
    this.regDate = moment().format('DD/MM/YYYY');
    this.isBanned = {
      banned: false
    }
  }

  createProfile(phone, fullname, username){
    const profile = new Profile(this.id, phone, fullname, _users[this.id].username, this.id)
    _profiles.push(profile)
  }

  createSocials(vk, fb){
    const social = new Social(this.id, vk, fb, this.id)
    _socials.push(social)
  }

  ban(reason){
    this.isBanned.reason = `${reason}`
    this.isBanned.banned = !this.isBanned.banned
  }

  get profileName(){
    let fullName = _profiles[this.id - 1].fullname
    return `Имя пользователя - ${fullName}`
  }

  get socialLinks(){
    let vk = _socials[this.id - 1].vk
    let fb = _socials[this.id - 1].fb
    return `Вконтакте - ${vk}. Фейсбук - ${fb}`
  }

  static userRandom(l){
    let result           = [];
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < l; i++) {
      result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
  }

  static userIdCount(){
    _id++
  }
}

// Класс Профиль

class Profile{
  constructor(id, phone, fullname, username, user_id) {
    this.id = id
    this.username = username
    this.phone = phone
    this.fullname = fullname
    this.user_id = user_id
  }
}

// Класс Сети

class Social {
  constructor(id, vk, fb, user_id) {
    this.id = id
    this.vk = vk
    this.fb = fb
    this.regDate = moment().format('DD/MM/YYYY');
    this.user_id = user_id
  }
}

//UI

class UI {
  static render(){
    const list = document.querySelector('#user-list');
    list.innerHTML ='';
    for (let i = 0; i < _users.length; i++){

      const tr = document.createElement('tr');

      tr.innerHTML = `
      <td class="item-username">${_users[i].username}</td>
      <td><a href="#" class="item-profile">${_profiles[i].fullname}</a></td>
      <td class="item-social"><a href="${_socials[i].vk}"><i class="fab fa-vk"></i></a> <a href="${_socials[i].fb}"><i class="fab fa-facebook-f"></i></a></td>
      <td><a class="btn btn-danger btnDelete">Пока для красоты</a></td>
      `;
      list.append(tr)
      let allProfiles = document.querySelectorAll('.item-profile')
      allProfiles[i].addEventListener('click', ()=>{
        console.log(_profiles[i])
      })

    }
  }
}