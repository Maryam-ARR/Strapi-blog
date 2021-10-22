import React from "react";
import { Tab, Tabs, AppBar, Box } from "@material-ui/core";
import Agenda from "../components/Articles/ArticleAgenda.js";
import ArticleCaldr from "../components/Articles/ArticleCaldr.js";
import ArticleCreate from "../components/Articles/ArticleCreate.js";
import SwipeableViews from "react-swipeable-views";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}>
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}
function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

class Articles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };
    this.handleChange = this.handleChange.bind(this);
    this.chandleChangeIndex = this.chandleChangeIndex.bind(this);
  }

  handleChange(event, newValue) {
    this.setState({ value: newValue });
  }
  chandleChangeIndex(index) {
    this.setState({ value: index });
  }
  render() {
    return (
      <>
        <AppBar position='static' color='default'>
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor='primary'
            textColor='primary'
            variant='fullWidth'
            aria-label='full width tabs example'>
            <Tab label='Creer' {...a11yProps(0)} />
            <Tab label='Calendrier' {...a11yProps(1)} />
            <Tab label='Agenda' {...a11yProps(2)} />
          </Tabs>
        </AppBar>
        <SwipeableViews
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}>
          <TabPanel value={this.state.value} index={0}>
            {this.state.value === 0 ? <ArticleCreate /> : <></>}
          </TabPanel>
          <TabPanel value={this.state.value} index={1}>
            {this.state.value === 1 ? <ArticleCaldr /> : <></>}
          </TabPanel>
          <TabPanel value={this.state.value} index={2}>
            {this.state.value === 2 ? <Agenda /> : <></>}
          </TabPanel>
        </SwipeableViews>
      </>
    );
  }
}
export default Articles;
