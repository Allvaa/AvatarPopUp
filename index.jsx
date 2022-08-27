const { Plugin } = require("powercord/entities");
const { React, getModule, getModuleByDisplayName, subscribe } = require("powercord/webpack");
const { inject, uninject } = require("powercord/injector");
const { open } = require("powercord/modal");

module.exports = class AvatarPopUp extends Plugin {
    startPlugin() {
        const { avatarHoverTarget, clickable, avatarHintInner } = getModule(['avatarHint'], false);
        const Clickable = getModuleByDisplayName("Clickable", false);
        const Mask = getModuleByDisplayName("Mask", false);

        subscribe(x => x.default?.displayName === "UserProfileModalHeader", UserProfileModalHeader => {
            inject("avatar-popup", UserProfileModalHeader, "default", (args, res) => {
                const avatar = res.props.children[1].props.children[0].props.children[1];
                res.props.children[1].props.children[0].props.children[1] = <Clickable className={`avatarWrapperNormal-ahVUaC ${clickable}`} onClick={() => this._openAvatarModal(args[0].user)}>
                    <div className={avatarHoverTarget}>
                        {avatar}
                    </div>
                    <Mask className="avatarHint-k7pYop" style={({ top: "-60px", left: "24px" })} mask="svg-mask-avatar-status-round-120" width="120" height="120">
                        <div className={avatarHintInner}>
                            <span className="avatarHintInnerText-9TQf9n">View Avatar</span>
                        </div>
                    </Mask>
                </Clickable>;
                return res;
            });
        })
    }
    pluginWillUnload() {
        uninject("avatar-popup");
    }

    _openAvatarModal(user) {
        const { getUserAvatarURL } = getModule(['getUserAvatarURL'], false);
        const { downloadLink } = getModule(['downloadLink'], false);
        const ImageModal = getModuleByDisplayName("ImageModal", false);
        const Anchor = React.memo(getModuleByDisplayName("Anchor", false));

        const avatarURL = getUserAvatarURL(user, user.avatar?.startsWith("a_"), 512);
        open(() => <>
            <ImageModal src={avatarURL}></ImageModal>
            <Anchor className={downloadLink} href={avatarURL} target="_blank">Open in browser</Anchor>
        </>);
    }
}