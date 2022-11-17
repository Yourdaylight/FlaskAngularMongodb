from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()

class EntityBase(object):
    def to_json(self):
        fields = self.__dict__
        if "_sa_instance_state" in fields:
            del fields["_sa_instance_state"]
        return fields


class Intention(db.Model, EntityBase):
    # 数据表明、字段
    __tablename__ = 'intention'
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    uid = db.Column(db.Integer)
    school_name = db.Column(db.String(255))
    score = db.Column(db.DECIMAL(10, 2))
    create_time = db.Column(db.DateTime)

    def __init__(self, id, uid, school_name, score, create_time):
        self.id = id
        self.uid = uid
        self.school_name = school_name
        self.score = score
        self.create_time = create_time

    def instance_to_json(self):
        content = {
            "id": self.id,
            "uid": self.uid,
            "school_name": self.school_name,
            "score": str(self.score),
            "create_time": self.create_time.strftime("%Y-%m-%d %H:%M:%S")
        }
        return content
