import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { EditIcon, TrashIcon } from "./Icons";

interface TaskMenuProps {
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const TaskMenu = ({
  visible,
  onClose,
  onEdit,
  onDelete,
}: TaskMenuProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.menu}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              onClose();
              onEdit();
            }}
            activeOpacity={0.7}
          >
            <EditIcon size={22} color="#3B82F6" />
            <Text style={[styles.menuText, { color: "#3B82F6" }]}>
              Edit Task
            </Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              onClose();
              onDelete();
            }}
            activeOpacity={0.7}
          >
            <TrashIcon size={22} color="#EF4444" />
            <Text style={[styles.menuText, { color: "#EF4444" }]}>
              Delete Task
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  menu: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: 200,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 12,
  },
});
