import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { theme } from '@/constants/theme';
import { X } from 'lucide-react-native';

interface DatePickerProps {
  visible: boolean;
  date: Date;
  onDateChange: (date: Date) => void;
  onClose: () => void;
}

export default function DatePicker({ visible, date, onDateChange, onClose }: DatePickerProps) {
  const handleDateChange = (newDate: Date) => {
    onDateChange(newDate);
  };
  
  // Generate an array of months
  const getMonths = () => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    return monthNames.map((name, index) => ({
      label: name,
      value: index,
    }));
  };
  
  // Generate an array of years (current year to +30 years)
  const getYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    
    for (let i = 0; i <= 30; i++) {
      years.push({
        label: (currentYear + i).toString(),
        value: currentYear + i,
      });
    }
    
    return years;
  };
  
  // Generate array of days based on selected month and year
  const getDays = () => {
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const days = [];
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        label: i.toString(),
        value: i,
      });
    }
    
    return days;
  };
  
  const months = getMonths();
  const years = getYears();
  const days = getDays();
  
  const selectedMonth = date.getMonth();
  const selectedDay = date.getDate();
  const selectedYear = date.getFullYear();
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Date</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <X size={24} color={theme.colors.text.primary} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.dateDisplay}>
                <Text style={styles.selectedDateText}>
                  {date.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </Text>
              </View>
              
              <View style={styles.pickerContainer}>
                <View style={styles.pickerColumn}>
                  <Text style={styles.pickerLabel}>Month</Text>
                  <View style={styles.pickerOptions}>
                    {months.map((month) => (
                      <TouchableOpacity
                        key={month.value}
                        style={[
                          styles.pickerOption,
                          selectedMonth === month.value && styles.selectedOption,
                        ]}
                        onPress={() => {
                          const newDate = new Date(date);
                          newDate.setMonth(month.value);
                          // Adjust for months with fewer days
                          const daysInNewMonth = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate();
                          if (newDate.getDate() > daysInNewMonth) {
                            newDate.setDate(daysInNewMonth);
                          }
                          handleDateChange(newDate);
                        }}
                      >
                        <Text 
                          style={[
                            styles.pickerOptionText,
                            selectedMonth === month.value && styles.selectedOptionText,
                          ]}
                        >
                          {month.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                
                <View style={styles.pickerColumn}>
                  <Text style={styles.pickerLabel}>Day</Text>
                  <View style={styles.pickerOptions}>
                    {days.map((day) => (
                      <TouchableOpacity
                        key={day.value}
                        style={[
                          styles.pickerOption,
                          selectedDay === day.value && styles.selectedOption,
                        ]}
                        onPress={() => {
                          const newDate = new Date(date);
                          newDate.setDate(day.value);
                          handleDateChange(newDate);
                        }}
                      >
                        <Text 
                          style={[
                            styles.pickerOptionText,
                            selectedDay === day.value && styles.selectedOptionText,
                          ]}
                        >
                          {day.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                
                <View style={styles.pickerColumn}>
                  <Text style={styles.pickerLabel}>Year</Text>
                  <View style={styles.pickerOptions}>
                    {years.map((year) => (
                      <TouchableOpacity
                        key={year.value}
                        style={[
                          styles.pickerOption,
                          selectedYear === year.value && styles.selectedOption,
                        ]}
                        onPress={() => {
                          const newDate = new Date(date);
                          newDate.setFullYear(year.value);
                          handleDateChange(newDate);
                        }}
                      >
                        <Text 
                          style={[
                            styles.pickerOptionText,
                            selectedYear === year.value && styles.selectedOptionText,
                          ]}
                        >
                          {year.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
              
              <TouchableOpacity
                style={styles.doneButton}
                onPress={onClose}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.large,
    borderTopRightRadius: theme.borderRadius.large,
    padding: theme.spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  modalTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.text.primary,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  dateDisplay: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    ...theme.shadows.small,
  },
  selectedDateText: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.primary,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  pickerColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
  pickerLabel: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  pickerOptions: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    maxHeight: 200,
    overflow: 'scroll',
    ...theme.shadows.small,
  },
  pickerOption: {
    padding: theme.spacing.md,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  selectedOption: {
    backgroundColor: 'rgba(0, 102, 204, 0.1)',
  },
  pickerOptionText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  selectedOptionText: {
    fontFamily: theme.typography.fontFamily.semiBold,
    color: theme.colors.primary,
  },
  doneButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  doneButtonText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: '#FFFFFF',
  },
});