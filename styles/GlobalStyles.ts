import { StyleSheet, Platform } from "react-native";

const styles = StyleSheet.create({
  background: {
    flex: 1
  },
  lightThemeBackground: {
    backgroundColor: '#f2f2f2'
  },
  darkThemeBackground: {
    backgroundColor: '#121212'
  },

  lightThemeText: {
    color: 'black'
  },
  darkThemeText: {
    color: 'white'
  },

  input: {
    padding: 15,
    borderRadius: 10,
    marginTop: 10
  },
  lightThemeInput: {
    color: 'black',
    backgroundColor: '#fef9f3'
  },
  darkThemeInput: {
    color: 'white',
    backgroundColor: '#212427'
  },

  button: {
    padding: 15,
    borderRadius: 15,
    marginTop: 15
  },
  lightThemeButton: {
    backgroundColor: 'black',
  },
  darkThemeButton: {
    backgroundColor: '#212427'
  },

  validationErrorsSection: {
    width: Platform.OS !== "web" ? '90%' : 'auto',
    marginTop: 15,
    padding: 25,
    backgroundColor: '#ffcccb',
    borderColor: 'darkred',
    borderWidth: 1,
    borderRadius: 15,
  },

  blurContainer: {
    flex: 1,
    zIndex: 150,
    position: 'absolute',
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0,
    width: '100%',
    height: '100%'
  },
})

export default styles;