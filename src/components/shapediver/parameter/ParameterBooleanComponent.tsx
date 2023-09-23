import { Switch } from "@mantine/core";
import React, { JSX, useEffect, useRef, useState } from "react";
import ParameterLabelComponent from "components/shapediver/parameter/ParameterLabelComponent";
import ParameterComponentBase from "components/shapediver/parameter/ParameterComponentBase";
import { useShapediverStoreCommon } from "context/shapediverStoreCommon";
import { PropsParameters } from "types/components/shapediver/uiParameter";

/**
 * Functional component that creates a button for a boolean parameter.
 * It displays a Skeleton if the session is not accessible yet.
 *
 * @returns
 */
export default function ParameterBooleanComponent({ parameterId, sessionId }: PropsParameters): JSX.Element {
	const sessionParameters = useRef(useShapediverStoreCommon(state => state.parameters[sessionId]));
	const changeParameterProperty = useShapediverStoreCommon((state) => state.parameterPropertyChange);
	const [loading, setLoading] = useState(true);
	const [element, setElement] = useState(<></>);

	useEffect(() => {
		const parameter = sessionParameters.current ? sessionParameters.current[parameterId] : undefined;

		// early return if the parameter is not in the store (yet)
		if (!parameter) return;

		// deactivate the loading mode
		setLoading(false);

		const defaultValue = (parameter.value === true || parameter.value === "true");

		// callback for when the value was changed
		const handleChange = (value: boolean) => {
			if (!parameter) return;

			// set the value and customize the session
			changeParameterProperty(sessionId, parameterId, "value", value);
		};

		// set the element with the label and a switch which triggers the handleChange-callback
		setElement(
			<>
				<ParameterLabelComponent sessionId={sessionId} parameterId={parameterId} />
				<Switch
					styles={() => ({
						track: { cursor: "pointer" },
					})}
					size="md"
					defaultChecked={defaultValue}
					onChange={(event) => handleChange(event.currentTarget.checked)}
				/>
			</>
		);
	}, [sessionId, parameterId]);

	return (<ParameterComponentBase loading={loading} element={element} />);
}