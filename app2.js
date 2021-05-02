// ивенты
document.querySelector('#btnRandom').addEventListener('click', (e) => { //при клике на кнопку создаем фейк пользователя
  const user = new User(User.userRandom(7), User.userRandom(10))
  Storage.push(user)
  user.createProfile(faker.phone.phoneNumber(), faker.name.findName())
  user.createSocials(`https://vk.com/id${Math.floor(Math.random() * 1000000)}`, `https://facebook.com/profile.php?id=${Math.floor(Math.random() * 1000000)}`)
  Storage.save()
  UI.render()
})

class Zaglushka {
  static _id = null

  /**
   * ТЕСТОВЫЙ КЛАСС!
   */

  constructor () {
    this.id = Zaglushka.getNextId()
    this.name = 'Заглушка для тестов'
  }

  static getNextId () {
    if (Number.isInteger(User._id)) {
      this._id++
    } else {
      this._id = 1
    }
    return this._id
  }
}

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
    }  // ВОЗМОЖНО ОШИБКА
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
    try {
      // здесь мы парсим из ЛС или ставим 0, потому что getNextId прибавит +1
      User._id = parseInt(localStorage.getItem('UserLastId')) || 0
    } catch (e) {
      console.log(e)
      User._id = 0
    }
  }

  createProfile (phone, fullname, username) { // метод создания профиля пользователя
    const profile = new Profile(phone, fullname, this.username, this.id)
    Storage.push(profile)
    Storage.save()
  }

  createSocials (vk, fb) { // метод создания социалок пользователя (?)
    const social = new Social(vk, fb, this.id)
    Storage.push(social)
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
    try {
      Profile._id = parseInt(localStorage.getItem('ProfileLastId')) || 0
    } catch (e) {
      console.log(e)
      Profile._id = 0
    }
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
    try {
      Social._id = parseInt(localStorage.getItem('SocialLastId')) || 0
    } catch (e) {
      console.log(e)
      Social._id = 0
    }
  }
}

//UI

class UI {
  static render () {
    const list = document.querySelector('#user-list')
    list.innerHTML = ''
    let array = Storage.getByClass('User')
    for (let i = 0; i < array.length; i++) {
      let profile = Storage.getByField('Profile', 'user_id', array[i].id)
      let social = Storage.getByField('Social', 'user_id', array[i].id)
      const tr = document.createElement('tr')
      tr.innerHTML = `
      <td class="item-username">${array[i].username}</td>
      <td><a href="#" class="item-profile">${profile.fullname}</a></td>
      <td class="item-social"><a href="${social.vk}"><i class="fab fa-vk"></i></a> <a href="${social.fb}"><i class="fab fa-facebook-f"></i></a></td>
      <td><a class="btn btn-danger btnDelete">Пока для красоты</a></td>
      `
      list.append(tr)
      // тут логично было бы вывести всю инфу из профиля - телефон там и прочее, фио )
//      // накидываю слушателей на ссылки профиля
//      let allProfiles = document.querySelectorAll('.item-profile')
//      allProfiles[i].addEventListener('click', () => {
//        array.forEach((profile, index) => {
//          if (profile.user_id === Storage._array[i].id) {
//            console.log(profile) // вывод профилей, которые относятся к данному пользователю. Надо было делать не профили, а типа сообщения. А то совсем чет странное получается :D
//          }
//        })
//      })
    }
  }
}

// localStorage

class Storage {
  static _savers = {}
  static _db = {}

  static push (item) { //закидывает в _array
    if (typeof item === 'object') {
      let className = item.constructor.name
      if (!Array.isArray(Storage._db[className])) {
        Storage._db[className] = []
      }
      if (!Storage._savers.hasOwnProperty(className) && item.constructor.hasOwnProperty('saveId') && typeof item.constructor.saveId === 'function') {
        Storage._savers[className] = item.constructor.saveId
      }
      Storage._db[className].push(item)
    } else {
      console.log('Что-то не то попало в Storage.push()')
    }
  }

  static getByClass (className = null) {
    if (Storage._db.hasOwnProperty(className) && Array.isArray(Storage._db[className])) {
      return Storage._db[className]
    }
    return []
  }

  static getById( className, id = null ) {
    let list = Storage.getByClass(className)
    return list.find(e => e.id === id)
  }

  static getByField( className, field, value = null ) {
    let list = Storage.getByClass(className)
    return list.find(e => e.hasOwnProperty(field) && e[field] === value)
  }

  static save () { //сохранение в хранилище
    localStorage.setItem('Storage', JSON.stringify(Storage._db))
    for (let c of Object.keys(this._db)) {
      if (Array.isArray(Storage._db[c]) && Storage._db[c].length && Storage._savers.hasOwnProperty(c) && typeof Storage._savers[c] === 'function') {
        Storage._savers[c]()
      }
    }
  }

  static load () { // загрузка из хранилища
    try {
      Storage._db = JSON.parse(localStorage.getItem('Storage')) || {}
      for (let c of Object.keys(this._db)) {
        Array(Storage._db[c]).forEach((e, i) => {
          e = Object.assign(Function(`new ${c}()`), e)
        })
        Function(`${c}.loadId()`)
      }
    } catch (e) {
      console.log(e)
    }
    UI.render()
  }
}

Storage.load()