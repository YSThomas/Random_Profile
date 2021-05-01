// ивенты
document.querySelector('#btnRandom').addEventListener('click', (e) => { //при клике на кнопку создаем фейк пользователя
  const user = new User(User.userRandom(7), User.userRandom(10))
  const test = new Zaglushka() //удалить после теста
  Storage.push(user)
  Storage.push(test) //удалить после теста
  // console.log(Storage._array)
  user.createProfile(faker.phone.phoneNumber(), faker.name.findName())
  user.createSocials(`https://vk.com/id${Math.floor(Math.random() * 1000000)}`, `https://facebook.com/profile.php?id=${Math.floor(Math.random() * 1000000)}`)
  Storage.save()
  UI.render()
})

class Zaglushka{
  static _id = null

  /**
   * ТЕСТОВЫЙ КЛАСС!
   */

  constructor() {
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
    // if (User._id === null) {
    //   User.loadId()
    // }  // ВОЗМОЖНО ОШИБКА
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
    // if (Profile._id === null) {
    //   Profile.loadId()
    // }
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
    // if (Social._id === null) {
    //   Social.loadId()
    // }
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
    for (let i = 0; i < Storage._array.length; i++) {
      const tr = document.createElement('tr')

      tr.innerHTML = `
      <td class="item-username">${Storage._array[i].username}</td>
      <td><a href="#" class="item-profile">${Storage._array[i].fullname}</a></td>
      <td class="item-social"><a href="${Storage._array[i].vk}"><i class="fab fa-vk"></i></a> <a href="${Storage._array[i].fb}"><i class="fab fa-facebook-f"></i></a></td>
      <td><a class="btn btn-danger btnDelete">Пока для красоты</a></td>
      `
      list.append(tr)

      // накидываю слушателей на ссылки профиля
      let allProfiles = document.querySelectorAll('.item-profile')
      allProfiles[i].addEventListener('click', () => {
        Storage._array.forEach((profile, index) => {
          if (profile.user_id === Storage._array[i].id) {
            console.log(profile) // вывод профилей, которые относятся к данному пользователю. Надо было делать не профили, а типа сообщения. А то совсем чет странное получается :D
          }
        })
      })
    }
  }
}

// localStorage

class Storage {
  static _all = []
  static _array = []
  static _classes = []

  static push(item){ //закидывает в _array
    if(item.__proto__.constructor){
      this._array.push(item)
      // console.log(`Это был ${item.__proto__.constructor.name}`)
    }else{
      console.log('Что-то не то попало в Storage.push()')
    }
  }

  static save () { //сохранение в хранилище

    this._classes = [...new Set(Storage._array.map(el => {
      if (el.constructor.name){
        return el.constructor.name
      }
    }))]

    for (let j = 0; j < this._classes.length; j++){
    let _forPush = []
      for(let i = 0; i < this._array.length; i++){
          if (this._classes[j] === this._array[i].constructor.name){
            _forPush.push(this._array[i])
            // console.log(_forPush)
          }
      }
            localStorage.setItem(this._classes[j], JSON.stringify(_forPush))
    }

    localStorage.setItem('all', JSON.stringify(this._array))
    User.saveId()
    Profile.saveId()
    Social.saveId()
  }

  static load () { // загрузка из хранилища
    let keys = []
    let local = Object.keys(localStorage)
    console.log(local)

      try {
        keys = JSON.parse(localStorage.getItem('all'))

        // Обходим массивы, присваиваем классы объектам. Если это массивы ;)

        if (Array.isArray(keys) && keys.length) {
          local.forEach((item, index)=>{
            keys.forEach((e, i) => {
                  // this._array.push(Object.assign(new User(), keys[i]))
            })
          })
        }
        // console.log(keys)
      } catch (e) {
        console.error(e)
      }
    UI.render()
  }
}

Storage.load()