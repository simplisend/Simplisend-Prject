import React, { Component } from "react";
import { Translator } from "../../../../../components/utils";
import MailItem from "./mailItem";

class Mail extends Component {
  render = () => {
    return (
      <div className="content-wrapper_2">
        <div className="title-block">
          <Translator string="mail" />
        </div>
        <div className="input-wrapper">
          <div className="column">
            <button className="mail-button">
              <Translator string="inbox" />
            </button>
            <button className="mail-button">
              <Translator string="outbox" />
            </button>
            <button className="mail-button">
              <Translator string="pending" />
            </button>

            <div className="mail-details" />
          </div>

          <div className="column ">
            <MailItem />
            <MailItem />
            <MailItem />
            <MailItem />
            <MailItem />
            <MailItem />
            <MailItem />
            <MailItem />
            <MailItem />
          </div>
        </div>
      </div>
    );
  };
}

export default Mail;
