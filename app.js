// ивенты
document.querySelector('#btnRandom').addEventListener('click', (e) => { //при клике на кнопку создаем фейк пользователя
  const user = new User(User.userRandom(7), User.userRandom(10))
  Storage._users.push(user)
  console.log(Storage._users)
  user.createProfile(faker.phone.phoneNumber(), faker.name.findName(), this.username)
  user.createSocials(`https://vk.com/id${Math.floor(Math.random() * 1000000)}`, `https://facebook.com/profile.php?id=${Math.floor(Math.random() * 1000000)}`)
  Storage.save()
  UI.render()
})

// Класс Пользователь

class User {
  static _id = null

  /**
   * Создает объект акакунта пользователя
   *
   * @param username
   * @param password
   * @param isBanned
   */
  constructor (username = null, password = null, isBanned = false) {
    if (User._id === null) {
      User.loadId()
    }
    this.id = User.getNextId()
    this.username = username
    this.password = password
    this.regDate = moment().format('DD/MM/YYYY')
    this.isBanned = {
      banned: isBanned
    }
  }

  static getNextId () {
    if (Number.isInteger(User._id)) {
      User._id++
    } else {
      User._id = 1
    }
    return User._id
  }

  static saveId () {
    localStorage.setItem('UserLastId', User._id)
  }

  static loadId () {
    // здесь мы парсим из ЛС или ставим 0, потому что getNextId прибавит +1
    User._id = parseInt(localStorage.getItem('UserLastId')) || 0
  }

  createProfile (phone = null, fullname = null, username = null) { // метод создания профиля пользователя
    const profile = new Profile(phone, fullname, username, this.id)
    Storage._profiles.push(profile)
    Storage.save()
  }

  createSocials (vk, fb) { // метод создания социалок пользователя (?)
    const social = new Social(vk, fb, this.id)
    Storage._socials.push(social)
    Storage.save()
  }

  ban (reason) { // метод блокировки пользователя
    this.isBanned.reason = `${reason}`
    this.isBanned.banned = !this.isBanned.banned
    Storage.save()
  }

  get profileName () { // получение полного имени (Это я просто чутка баловался)
    let fullName = Storage._profiles[this.id - 1].fullname
    return `Имя пользователя - ${fullName}`
  }

  get socialLinks () { // вывод социалок (Это я тоже просто баловался)
    let vk = Storage._socials[this.id - 1].vk
    let fb = Storage._socials[this.id - 1].fb
    return `Вконтакте - ${vk}. Фейсбук - ${fb}`
  }

  static userRandom (l) { // рандомайзер буковок (l - длина), чтоб имитировать логин юзера
    let result = []
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let charactersLength = characters.length
    for (let i = 0; i < l; i++) {
      result.push(characters.charAt(Math.floor(Math.random() * charactersLength)))
    }
    return result.join('')
  }
}

// Класс Профиль

class Profile {
  static _id = null

  /**
   * Создает объект профиля пользователя
   *
   * @param phone
   * @param fullname
   * @param username
   * @param user_id - делать его null по умолчанию, неправильно - нужно валидировать. Для простоты - пока оставим это так, но консистентность данных может пострадать на раз
   */
  constructor (phone = null, fullname = null, username = null, user_id = null) {
    if (Profile._id === null) {
      Profile.loadId()
    }
    this.id = Profile.getNextId()
    this.username = username
    this.phone = phone
    this.fullname = fullname
    this.user_id = user_id
  }

  static getNextId () {
    if (Number.isInteger(Profile._id)) {
      Profile._id++
    } else {
      Profile._id = 1
    }
    return Profile._id
  }

  static saveId () { // сохраняем значение айдишника в хранилище
    localStorage.setItem('ProfileLastId', Profile._id)
  }

  static loadId () {
    Profile._id = parseInt(localStorage.getItem('ProfileLastId')) || 0
  }
}

// Класс Сети

class Social {
  static _id = null

  /**
   * Создает объект с набором соцсетей пользователя
   *
   * @param vk
   * @param fb
   * @param user_id
   */
  constructor (vk = null, fb = null, user_id = null) {
    if (Social._id === null) {
      Social.loadId()
    }
    this.id = Social.getNextId()
    this.vk = vk
    this.fb = fb
    this.regDate = moment().format('DD/MM/YYYY')
    this.user_id = user_id
  }

  static getNextId () {
    if (Number.isInteger(Social._id)) {
      Social._id++
    } else {
      Social._id = 1
    }
    return Social._id
  }

  static saveId () { // сохраняем значение айдишника в хранилище
    localStorage.setItem('SocialLastId', Social._id)
  }

  static loadId () {
    Social._id = parseInt(localStorage.getItem('SocialLastId')) || 0
  }
}

//UI

class UI {
  static render () {
    const list = document.querySelector('#user-list')
    list.innerHTML = ''
    for (let i = 0; i < Storage._users.length; i++) {
      const tr = document.createElement('tr')

      tr.innerHTML = `
      <td class="item-username">${Storage._users[i].username}</td>
      <td><a href="#" class="item-profile">${Storage._profiles[i].fullname}</a></td>
      <td class="item-social"><a href="${Storage._socials[i].vk}"><i class="fab fa-vk"></i></a> <a href="${Storage._socials[i].fb}"><i class="fab fa-facebook-f"></i></a></td>
      <td><a class="btn btn-danger btnDelete">Пока для красоты</a></td>
      `
      list.append(tr)

      // накидываю слушателей на ссылки профиля
      let allProfiles = document.querySelectorAll('.item-profile')
      allProfiles[i].addEventListener('click', () => {
        Storage._profiles.forEach((profile, index) => {
          if (profile.user_id === Storage._users[i].id) {
            console.log(profile) // вывод профилей, которые относятся к данному пользователю. Надо было делать не профили, а типа сообщения. А то совсем чет странное получается :D
          }
        })
      })
    }
  }
}

// localStorage

class Storage {
  static _users = []
  static _profiles = []
  static _socials = []

  static save () { //сохранение в хранилище
    localStorage.setItem('Users', JSON.stringify(Storage._users))
    User.saveId()
    localStorage.setItem('Profiles', JSON.stringify(Storage._profiles))
    Profile.saveId()
    localStorage.setItem('Socials', JSON.stringify(Storage._socials))
    Social.saveId()
  }

  static load () { // загрузка из хранилища
    let users = []
    let profiles = []
    let socials = []

    try {
      users = JSON.parse(localStorage.getItem('Users'),)
      profiles = JSON.parse(localStorage.getItem('Profiles'))
      socials = JSON.parse(localStorage.getItem('Socials'))

      // Обходим массивы, присваиваем классы объектам. Если это массивы ;)

      if (Array.isArray(users) && users.length) {
        users.forEach((e, i) => {
          Storage._users.push(Object.assign(new User(), users[i]))
        })
      }

      if (Array.isArray(users) && users.length) {
        profiles.forEach((e, i) => {
          Storage._profiles.push(Object.assign(new Profile(), profiles[i]))
        })
      }

      if (Array.isArray(users) && users.length) {
        socials.forEach((e, i) => {
          Storage._socials.push(Object.assign(new Social(), socials[i]))
        })
      }
    } catch (e) {
      console.error(e)
    }
    UI.render()
  }
}

Storage.load()
