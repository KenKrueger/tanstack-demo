import { createLink, LinkComponent, useRouter } from "@tanstack/react-router";
import {
  Link as RACLink,
  LinkProps as RACLinkProps,
  composeRenderProps,
} from "react-aria-components";

import { focusRing } from "./ui/utils";

interface BasicLinkProps extends RACLinkProps {
  // Add any additional props you want to pass to the anchor element
}

const BasicLinkComponent = (props: BasicLinkProps) => {
  return (
    <RACLink
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        focusRing({ ...renderProps, className })
      )}
    />
  );
};

const CreatedLinkComponent = createLink(BasicLinkComponent);

export const WrappedLink: LinkComponent<typeof BasicLinkComponent> = (
  props
) => {
  return <CreatedLinkComponent {...props} />;
};
