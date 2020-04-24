class Transx:
    def __init__(self, transx_id, desc, amount, date_approved, transx_type):
        self.transx_id = transx_id
        self.desc = desc
        self.amount = amount
        self.date_approved = date_approved
        self.transx_type = transx_type

    def get_transx_id(self):
        return self.transx_id

    def get_desc(self):
        return self.desc

    def get_amount(self):
        return self.amount

    def get_date_approved(self):
        return self.date_approved

    def get_transx_type(self):
        return self.transx_type

    def set_transx_id(self, transx_id):
        self.transx_id = transx_id

    def set_desc(self, desc):
        self.desc = desc

    def set_amount(self, amount):
        self.amount = amount

    def set_date_approved(self, date_approved):
        self.date_approved = date_approved

    def set_transx_type(self, transx_type):
        self.transx_type = transx_type

    def to_string(self):
        print(str(self.transx_id),
              str(self.desc),
              str(self.amount),
              str(self.date_approved),
              str(self.transx_type))
