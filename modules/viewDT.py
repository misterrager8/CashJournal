import sys

from java.awt import *
from javax.swing import *
from javax.swing.table import *

from model import Transx

mouse_loc = []


class Tablemodelwrapper(DefaultTableModel):
    def __init__(self):
        head = "ID,Description,Amount,Date,Type".split(",")
        self.data = []
        DefaultTableModel.__init__(self, self.data, head)

    @classmethod
    def getColumnClass(cls, col):
        types = [int, str, str, str, str]
        return types[col]

    @classmethod
    def isCellEditable(cls, row, col):
        canEdit = [False, True, True, True, True]
        return canEdit[col]


class Mainwindow(JFrame):
    def __init__(self):
        super(Mainwindow, self).__init__()

        self.bgPanel = JPanel(mousePressed=self.bgPanelMousePressed,
                              mouseDragged=self.bgPanelMouseDragged)
        self.exitButton = JLabel(mouseClicked=self.exitButtonMouseClicked)
        self.formPanel1 = JPanel()
        self.descLabel = JLabel()
        self.descField = JTextField(focusGained=self.descFieldFocusGained)
        self.amountLabel = JLabel()
        self.amountField = JTextField(focusGained=self.amountFieldFocusGained)
        self.dateLabel = JLabel()
        self.dateField = JTextField(focusGained=self.dateFieldFocusGained)
        self.typeLabel = JLabel()
        self.typeBox = JComboBox()
        self.addButton = JLabel(mouseEntered=self.addButtonMouseEntered,
                                mouseExited=self.addButtonMouseExited,
                                mouseClicked=self.addButtonMouseClicked)
        self.delButton = JLabel(mouseEntered=self.delButtonMouseEntered,
                                mouseExited=self.delButtonMouseExited,
                                mouseClicked=self.delButtonMouseClicked)
        self.editButton = JLabel(mouseEntered=self.editButtonMouseEntered,
                                 mouseExited=self.editButtonMouseExited,
                                 mouseClicked=self.editButtonMouseClicked)
        self.jScrollPane1 = JScrollPane()
        self.transxTable = JTable()
        self.formPanel2 = JPanel()
        self.blankPanel1 = JPanel()
        self.blankPanel2 = JPanel()
        self.blankPanel3 = JPanel()
        self.blankPanel4 = JPanel()
        self.blankPanel5 = JPanel()
        self.blankPanel6 = JPanel()
        self.blankPanel7 = JPanel()
        self.blankPanel8 = JPanel()
        self.filterBox = JComboBox()
        self.searchField = JTextField(focusGained=self.searchFieldFocusGained)
        self.searchButton = JLabel(mouseEntered=self.searchButtonMouseEntered,
                                   mouseExited=self.searchButtonMouseExited,
                                   mouseClicked=self.searchButtonMouseClicked)

        self.init_components()
        self.setVisible(True)

    def init_components(self):
        self.setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE)
        self.setUndecorated(True)
        self.setPreferredSize(Dimension(770, 570))
        self.getContentPane().setLayout(None)

        self.bgPanel.setBackground(Color(71, 142, 81))
        self.bgPanel.setLayout(None)

        self.exitButton.setHorizontalAlignment(SwingConstants.CENTER)
        self.exitButton.setText("X")
        self.exitButton.setCursor(Cursor(Cursor.HAND_CURSOR))
        self.bgPanel.add(self.exitButton)
        self.exitButton.setBounds(740, 0, 30, 30)

        self.formPanel1.setOpaque(False)
        self.formPanel1.setLayout(GridLayout(11, 1, 0, 5))

        self.descLabel.setText("Description")
        self.formPanel1.add(self.descLabel)
        self.formPanel1.add(self.descField)

        self.amountLabel.setText("Amount")
        self.formPanel1.add(self.amountLabel)
        self.formPanel1.add(self.amountField)

        self.dateLabel.setText("Date")
        self.formPanel1.add(self.dateLabel)
        self.formPanel1.add(self.dateField)

        self.typeLabel.setText("Type")
        self.formPanel1.add(self.typeLabel)

        self.typeBox.setModel(DefaultComboBoxModel(["Please Select", "Withdrawal", "Deposit"]))
        self.formPanel1.add(self.typeBox)

        self.addButton.setBackground(self.bgPanel.getBackground().brighter())
        self.addButton.setHorizontalAlignment(SwingConstants.CENTER)
        self.addButton.setText("Add")
        self.addButton.setCursor(Cursor(Cursor.HAND_CURSOR))
        self.addButton.setOpaque(True)
        self.formPanel1.add(self.addButton)

        self.delButton.setBackground(self.bgPanel.getBackground().brighter())
        self.delButton.setHorizontalAlignment(SwingConstants.CENTER)
        self.delButton.setText("Delete")
        self.delButton.setCursor(Cursor(Cursor.HAND_CURSOR))
        self.delButton.setOpaque(True)
        self.formPanel1.add(self.delButton)

        self.editButton.setBackground(self.bgPanel.getBackground().brighter())
        self.editButton.setHorizontalAlignment(SwingConstants.CENTER)
        self.editButton.setText("Edit")
        self.editButton.setCursor(Cursor(Cursor.HAND_CURSOR))
        self.editButton.setOpaque(True)
        self.formPanel1.add(self.editButton)

        self.bgPanel.add(self.formPanel1)
        self.formPanel1.setBounds(10, 10, 210, 330)

        self.transxTable.setModel(Tablemodelwrapper())
        self.jScrollPane1.setViewportView(self.transxTable)

        self.bgPanel.add(self.jScrollPane1)
        self.jScrollPane1.setBounds(10, 350, 750, 210)

        self.formPanel2.setOpaque(False)
        self.formPanel2.setLayout(GridLayout(11, 1, 0, 5))

        self.blankPanel1.setOpaque(False)
        self.blankPanel1.setLayout(GridLayout())
        self.formPanel2.add(self.blankPanel1)

        self.blankPanel2.setOpaque(False)
        self.blankPanel2.setLayout(GridLayout())
        self.formPanel2.add(self.blankPanel2)

        self.blankPanel3.setOpaque(False)
        self.blankPanel3.setLayout(GridLayout())
        self.formPanel2.add(self.blankPanel3)

        self.blankPanel4.setOpaque(False)
        self.blankPanel4.setLayout(GridLayout())
        self.formPanel2.add(self.blankPanel4)

        self.blankPanel5.setOpaque(False)
        self.blankPanel5.setLayout(GridLayout())
        self.formPanel2.add(self.blankPanel5)

        self.blankPanel6.setOpaque(False)
        self.blankPanel6.setLayout(GridLayout())
        self.formPanel2.add(self.blankPanel6)

        self.blankPanel7.setOpaque(False)
        self.blankPanel7.setLayout(GridLayout())
        self.formPanel2.add(self.blankPanel7)

        self.blankPanel8.setOpaque(False)
        self.blankPanel8.setLayout(GridLayout())
        self.formPanel2.add(self.blankPanel8)

        self.filterBox.setModel(DefaultComboBoxModel(["Description", "Date"]))
        self.formPanel2.add(self.filterBox)
        self.formPanel2.add(self.searchField)

        self.searchButton.setBackground(self.bgPanel.getBackground().brighter())
        self.searchButton.setHorizontalAlignment(SwingConstants.CENTER)
        self.searchButton.setText("Search")
        self.searchButton.setCursor(Cursor(Cursor.HAND_CURSOR))
        self.searchButton.setOpaque(True)
        self.formPanel2.add(self.searchButton)

        self.bgPanel.add(self.formPanel2)
        self.formPanel2.setBounds(520, 10, 210, 330)

        self.getContentPane().add(self.bgPanel)
        self.bgPanel.setBounds(0, 0, 770, 570)

        self.pack()
        self.setLocationRelativeTo(None)

    def bgPanelMousePressed(self, evt):
        del mouse_loc[:]
        mouse_loc.append(evt.getX())
        mouse_loc.append(evt.getY())

    def bgPanelMouseDragged(self, evt):
        x = evt.getXOnScreen()
        y = evt.getYOnScreen()

        self.setLocation(x - mouse_loc[0], y - mouse_loc[1])

    def exitButtonMouseClicked(self, evt):
        sys.exit()

    def descFieldFocusGained(self, evt):
        self.descField.selectAll()

    def amountFieldFocusGained(self, evt):
        self.amountField.selectAll()

    def dateFieldFocusGained(self, evt):
        self.dateField.selectAll()

    def searchFieldFocusGained(self, evt):
        self.searchField.selectAll()

    def addButtonMouseEntered(self, evt):
        self.addButton.setBorder(border.LineBorder(Color.black))

    def addButtonMouseExited(self, evt):
        self.addButton.setBorder(None)

    def addButtonMouseClicked(self, evt):
        a = None
        b = self.descField.getText()
        c = self.amountField.getText()
        d = self.dateField.getText()
        e = str(self.typeBox.getSelectedItem())

        x = Transx(a, b, c, d, e)

        self.clear_all()
        self.view_table()

    def delButtonMouseEntered(self, evt):
        self.delButton.setBorder(border.LineBorder(Color.black))

    def delButtonMouseExited(self, evt):
        self.delButton.setBorder(None)

    def delButtonMouseClicked(self, evt):
        print("delete")

    def addButtonMouseEntered(self, evt):
        self.addButton.setBorder(border.LineBorder(Color.black))

    def addButtonMouseExited(self, evt):
        self.addButton.setBorder(None)

    def delButtonMouseEntered(self, evt):
        self.delButton.setBorder(border.LineBorder(Color.black))

    def delButtonMouseExited(self, evt):
        self.delButton.setBorder(None)

    def editButtonMouseEntered(self, evt):
        self.editButton.setBorder(border.LineBorder(Color.black))

    def editButtonMouseExited(self, evt):
        self.editButton.setBorder(None)

    def editButtonMouseClicked(self, evt):
        print("edit")

    def searchButtonMouseEntered(self, evt):
        self.searchButton.setBorder(border.LineBorder(Color.black))

    def searchButtonMouseExited(self, evt):
        self.searchButton.setBorder(None)

    def searchButtonMouseClicked(self, evt):
        print("search")

    def clear_all(self):
        self.descField.setText("")
        self.amountField.setText("")
        self.dateField.setText("")
        self.typeBox.setSelectedIndex(0)

    def view_table(self):
        self.transxTable.getModel().addRow()


if __name__ == "__main__":
    Mainwindow()
