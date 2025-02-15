---
category: Components
group: Feedback
title: Popconfirm
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*sAGpRoBtTXcAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

A simple and compact confirmation dialog of an action.

## When To Use

A simple and compact dialog used for asking for user confirmation.

The difference with the `confirm` modal dialog is that it's more lightweight than the static popped full-screen confirm modal.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/locale.tsx">Locale text</code>
<code src="./demo/placement.tsx">Placement</code>
<code src="./demo/dynamic-trigger.tsx">Conditional trigger</code>
<code src="./demo/icon.tsx">Customize icon</code>
<code src="./demo/async.tsx">Asynchronously close</code>
<code src="./demo/promise.tsx">Asynchronously close on Promise</code>
<code src="./demo/render-panel.tsx" debug>_InternalPanelDoNotUseOrYouWillBeFired</code>
<code src="./demo/wireframe.tsx" debug>Wireframe</code>

## API

| Param | Description | Type | Default value | Version |
| --- | --- | --- | --- | --- |
| cancelButtonProps | The cancel button props | [ButtonProps](/components/button/#API) | - |  |
| cancelText | The text of the Cancel button | string | `Cancel` |  |
| disabled | Whether show popconfirm when click its childrenNode | boolean | false |  |
| icon | Customize icon of confirmation | ReactNode | &lt;ExclamationCircle /> |  |
| okButtonProps | The ok button props | [ButtonProps](/components/button/#API) | - |  |
| okText | The text of the Confirm button | string | `OK` |  |
| okType | Button `type` of the Confirm button | string | `primary` |  |
| showCancel | Show cancel button | boolean | true | 4.18.0 |
| title | The title of the confirmation box | ReactNode \| () => ReactNode | - |  |
| description | The description of the confirmation box title | ReactNode \| () => ReactNode | - | 5.1.0 |
| onCancel | A callback of cancel | function(e) | - |  |
| onConfirm | A callback of confirmation | function(e) | - |  |

Consult [Tooltip's documentation](/components/tooltip/#API) to find more APIs.

## Note

Please ensure that the child node of `Popconfirm` accepts `onMouseEnter`, `onMouseLeave`, `onFocus`, `onClick` events.
