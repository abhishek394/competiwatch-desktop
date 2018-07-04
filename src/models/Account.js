import Database from './Database'

class Account {
  static setupDatabase() {
    const db = Database.load('accounts')
    db.ensureIndex({ fieldName: 'battletag', unique: true }, err => {
      if (err) {
        console.error('failed to add accounts.battletag index', err)
      }
    })
    return db
  }

  static findAll(db) {
    return Database.findAll(db, 'account').
      then(rows => rows.map(data => new Account(data)))
  }

  static find(db, id) {
    return Database.find(db, id, 'account').then(data => new Account(data))
  }

  constructor(data) {
    this.battletag = data.battletag
    this._id = data._id
  }

  save(db) {
    const data = { battletag: this.battletag }
    return Database.upsert(db, data, this._id, 'account').
      then(newAccount => { this._id = newAccount._id })
  }

  delete(db) {
    return Database.delete(db, this._id, 'account')
  }
}

export default Account