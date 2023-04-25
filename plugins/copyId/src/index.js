
// Shiet bruh, vendetta has no documentation, these code originated from
// https://github.com/aeongdesu/vdplugins/tree/main/plugins/ViewRaw
// with modification to only add one button for copy user id when long message press.

const { before, after } = require("@vendetta/patcher")
const { getAssetId } = require("@vendetta/ui/assets")
const getAssetIDByName = getAssetId;
const { findByProps, findByName } = require("@vendetta/metro")
const getByProps = findByProps;
const { React } = require("@vendetta/metro/common")
const { Forms } = require("@vendetta/ui/components")

const ActionSheet = getByProps("openLazy", "hideActionSheet")
const Navigation = getByProps("push", "pushLazy", "pop")
const DiscordNavigator = getByProps("getRenderCloseButton")
const { Navigator, getRenderCloseButton } = DiscordNavigator;
const Icon = findByName("Icon")
const { FormRow } = Forms

const unpatch = before("openLazy", ActionSheet, (ctx) => {
    const [component, args, actionMessage] = ctx
    if (args !== "MessageLongPressActionSheet") return;
    component.then(instance => {
        const unpatch = after("default", instance, (_, component) => {
            React.useEffect(() => () => { unpatch() }, []) // omg!!!!!!!!!!!!!
            let [msgProps, buttons] = component.props?.children?.props?.children?.props?.children

            const message = msgProps?.props?.message ?? actionMessage?.message


            if (!buttons || !message) return;
            console.log(message);

            const navigator = () => (
                <Navigator
                    initialRouteName="RawPage"
                    goBackOnBackPress
                    screens={{
                        RawPage: {
                            title: "ViewRaw",
                            headerLeft: getRenderCloseButton(() => Navigation.pop()),
                            render: () => <RawPage message={message} />
                        }
                    }}
                />
            )

            buttons.push(
                <FormRow
                    label="Copy User Id"
                    leading={<Icon source={getAssetId("ic_chat_bubble_16px")} />}
                    onPress={() => {
                        ActionSheet.hideActionSheet()
                        clipboard.setString(message.id)
                        showToast("Copied User ID to clipboard", getAssetId("toast_copy_link"))
                    }}
                />)
        })
    })
})

module.exports = () => unpatch();
