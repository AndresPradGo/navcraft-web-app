
import { StyleSheet } from "@react-pdf/renderer";

const color ={
    primaryDark: "#060A0F",
    grey: "#707070",
    greyDark: "#292929",
    white: "#F5F5F5",
    contrastDark: "#A17402",
    highlightDark: "#1F7EC1",
    primaryLight: "#2A4865"
}

const styles = StyleSheet.create({
    body: {
      paddingTop: 35,
      paddingBottom: 65,
      paddingHorizontal: 35,
      backgroundColor: color.white
    },
    header: { 
        marginBottom: 20,
        color: color.grey,
        textAlign: "left",
        fontSize: 12,
        fontFamily: 'Helvetica-Oblique'
    },
    section: {
        marginVertical: 15
    },
    title1: {
        fontSize: 30,
        textAlign: 'center',
        fontFamily: "Times-Bold",
        color: color.contrastDark
    },
    title2: {
        fontSize: 24,
        textAlign: 'left',
        fontFamily: "Helvetica-Bold",
        color: color.highlightDark
    },
    title3: {
        fontSize: 18,
        textAlign: 'left',
        fontFamily: "Helvetica-Bold",
        color: color.primaryLight
    },
    
    text: {
        margin: 12,
        fontSize: 14,
        textAlign: 'justify',
        fontFamily: 'Helvetica',
        color: color.greyDark
    },
    report: {
        padding: 12,
        marginHorizontal: 30,
        marginVertical: 12,
        fontSize: 14,
        textAlign: 'left',
        fontFamily: 'Helvetica-Bold',
        color: color.primaryDark
    },
    image: {
        textAlign: "center",
        marginVertical: 12,
    },
    selectedImage: {
        textAlign: "center",
        border: `4px solid ${color.contrastDark}`,
        marginVertical: 12,
    },
    pageNumber: {
        position: 'absolute',
        fontSize: 12,
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'grey',
        fontFamily: 'Helvetica'
      },
  });

  export default styles