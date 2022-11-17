from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()


class EntityBase(object):
    def to_json(self):
        fields = self.__dict__
        if "_sa_instance_state" in fields:
            del fields["_sa_instance_state"]
        return fields


class User(db.Model, EntityBase):
    # 数据表明、字段
    __tablename__ = 'user'
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    username = db.Column(db.String(255))
    password = db.Column(db.String(255))
    role = db.Column(db.Integer())

    def __init__(self, id, username, password, role=2):
        self.id = id
        self.username = username
        self.password = password
        self.role = role

