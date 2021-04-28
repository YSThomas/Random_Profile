// глобальные переменные
let _users = []
let _profiles = []
let _socials = []

// ивенты

document.querySelector('#btnRandom').addEventListener('click', (e)=>{
  const user = new User(User.userRandom(7), User.userRandom(10))
  _users.push(user)
  User.idUser++
  user.createProfile(faker.phone.phoneNumber(), faker.name.findName())
  user.createSocials(`https://vk.com/id${Math.floor(Math.random() * 1000000)}`, `https://facebook.com/profile.php?id=${Math.floor(Math.random() * 1000000)}`)
  console.log(_users)
  UI.render()
})

// Класс Пользователь

class User{
  constructor(username, password) {
    this.id = User.idUser
    this.username = username
    this.password = password
    this.regDate = moment().format('DD/MM/YYYY');
    this.isBanned = {
      banned: false
    }
  }

  static idUser = 0

  createProfile(phone, fullname, username){
    const profile = new Profile(phone, fullname, _users[this.id].username, this.id)
    _profiles.push(profile)
    Profile.idProfile++
  }

  createSocials(vk, fb){
    const social = new Social(_socials.length, vk, fb, this.id)
    _socials.push(social)
    Social.idSocial++
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

  static idProfile = 0;
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

  static idSocial = 0;
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

      // накидываю слушателей на ссылки профиля
      let allProfiles = document.querySelectorAll('.item-profile')
      allProfiles[i].addEventListener('click', ()=>{
        _profiles.forEach((profile, index) =>{
          if(profile.user_id === _users[i].id){
            console.log(profile) // вывод профилей, которые относятся к данному пользователю. Надо было делать не профили, а типа сообщения. А то совсем чет странное получается :D
          }
        })
      })
    }
  }
}