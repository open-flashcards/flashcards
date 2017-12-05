import React from "react";
import PropTypes from "prop-types"; 
import PropTypesUtils from "../prop-types-utils";
import styles from "./Navbar.css";
import classnames from "classnames";
import logo from "../images/logo.svg";
import Container from "../ResponsiveContainer";
import Button from "../Button";
import Icon from "../Icon";

const Navbar = ({ title, actions, ...rest }) => {

  return (
    <nav {...rest} className={styles.root}>
      <Container className={styles.contentRoot}>
        <Logo />
        <Title title={title} />
        { actions ? <Actions actions={actions} /> : null }
        <Social />
        <Auth />
      </Container>
    </nav>
  );

};

Navbar.propTypes = {
  title: PropTypes.string.isRequired,
  actions: PropTypes.arrayOf(PropTypes.object),
};

const Logo = () => {
  return (
    <Section className={styles.logo} >
      <img src={logo} alt="Flashcards" height="32" />
      <span>Flashcards</span>
    </Section>
  );
};

const Title = ({ title }) => {
  return (
    <Section className={styles.title}>
      {title}
    </Section>
  );
};

Title.propTypes = {
  title: PropTypes.string.isRequired,
};

const Actions = ({ actions }) => {
  const renderAction = (action, key) => {
    const { tag, icon, text, className, ...rest } = action;
    return (
      <Button key={key} {...rest} tag={tag} className={classnames(styles.actionItem, className)}>
        <Icon icon={icon} className={styles.actionIcon} />
        <span className={styles.actionText}>
          { text }
        </span>
      </Button>
    );
  };

  Actions.propTypes = {
    actions: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  return (
    <Section className={styles.actions}>
      { actions.map(renderAction) }
    </Section>
  );
};

const Social = () => {
  return (
    <Section className={styles.social}>
      <Button tag="a" href={GITHUB}>
        <Icon icon="fa fa-github" className={styles.socialIcon} />
        GitHub
      </Button>
    </Section>
  );
};

const Auth = () => {
  return (
    <Section className={styles.auth}>
      Sign in
    </Section>
  );
};

const Section = ({ children, className }) => {
  return (
    <section className={classnames(styles.section, className)}>
      {children}
    </section>
  );
};

Section.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypesUtils.className,
};

export default Navbar;