/*
References
https://github.com/redstonekasi/vendetta-plugins/blob/main/plugins/saucenao
*/
import { React, ReactNative as RN } from "@vendetta/metro/common";
import { Forms } from "@vendetta/ui/components";
import { findByName, findByProps } from "@vendetta/metro";
import { after, before } from "@vendetta/patcher";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { storage } from "@vendetta/plugin";
import { useProxy } from "@vendetta/storage";
import { clipboard } from "@vendetta/metro/common";
import { showToast } from "@vendetta/ui/toasts"

const { FormRow } = Forms;
const Icon = findByName("Icon");

const ActionSheet = findByProps("openLazy", "hideActionSheet");
const { openURL } = findByProps("openURL", "openDeeplink");

const targetIcon = <Icon source={getAssetIDByName("copy")} />

// Just for a bit of separation
const unpatch = before("openLazy", ActionSheet, ([component, key]) => {
  if (key !== "MediaShareActionSheet") return;
  component.then((instance) => {
    const unpatchInstance = after("default", instance, ([{ syncer }], res) => {
      React.useEffect(() => void unpatchInstance(), []);

      let source = syncer.sources[syncer.index.value];
      if (Array.isArray(source)) source = source[0];
      const url = source.sourceURI ?? source.uri;

      const rows = res?.props?.children?.props?.children; 
      let share = rows.find(x => x.props?.label?.toLowerCase() == 'share');
      
      rows[rows.indexOf(share)] = (
        <FormRow
          leading={targetIcon}
          label={"Copy Image Link"}
          onPress={() => {
            ActionSheet.hideActionSheet()
            clipboard.setString(url)
            showToast("Image Url Copied", getAssetIDByName("toast_copy_link"))
          }}
          />
      );
    });
  });
});

export const onUnload = () => unpatch();
