import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    container: {
      flex: 1,
    },

    switchContainer: {
      flexDirection: "row",
      paddingLeft: 15,
      marginTop: 5,
      alignItems: "center",
    },
  
    rowContainer: {
      flexDirection: "row",
      paddingLeft: 10,
      paddingBottom:10,
      marginTop: 10,
    },

    rowContainerCenter: {
      flexDirection: "column",
      paddingLeft: 10,
      paddingBottom:10,
      marginTop: 10,
      justifyContent: 'center',
    },

    input: {
      borderBottomWidth: 1, 
      borderBottomColor: "black",
      fontSize:18,
      paddingLeft: 40,
      paddingRight: 40,
      marginLeft: 10,
    },
  });
  