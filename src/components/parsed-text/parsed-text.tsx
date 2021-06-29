import { FastImageProps, ImageStyle } from 'react-native-fast-image';
import React, { FunctionComponent, useMemo } from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { Text, TextProps } from 'react-native-elements';

export interface P9ParsedTextProps extends TextProps {
  parsers: P9TextParseRule[];
}

export const P9ParsedText: FunctionComponent<P9ParsedTextProps> = ({
  children,
  parsers,
  style: rootStyle,
  ...rest
}) => {
  const parsed = useMemo(() => {
    if (typeof children === 'string') {
      return parseText([{ match: children, style: rootStyle }], parsers, 0).map(({ element, match, style }, index) =>
        element ? (
          <React.Fragment key={index.toString()}>{element}</React.Fragment>
        ) : (
          <Text key={index.toString()} style={[style]}>
            {match}
          </Text>
        ),
      );
    } else {
      // throw new Error('Children of P9ParsedText must be a string.');
      return null;
    }
  }, [children, parsers, rootStyle]);

  return (
    <Text style={[rootStyle]} {...rest}>
      {parsed}
    </Text>
  );
};

export interface P9TextParseRule {
  pattern: RegExp;
  style?: StyleProp<ImageStyle | TextStyle>;
  transform?(
    match: string,
    style?: StyleProp<ImageStyle | TextStyle>,
    groups?: Array<RegExpMatchArray>,
  ): React.ReactElement | React.ReactElement[] | undefined;
}

export interface P9TextParseResult {
  match: string;
  groups?: RegExpMatchArray | null;
  style?: StyleProp<FastImageProps | TextStyle>;
  element?: React.ReactElement | React.ReactElement[] | undefined;
}

function parseText(input: P9TextParseResult[], parsers: P9TextParseRule[], iteration: number): P9TextParseResult[] {
  if (iteration === parsers.length) {
    return input;
  }

  const { pattern, style, transform } = parsers[iteration];

  return parseText(
    input.flatMap(({ match: parent, style: parentStyle }) =>
      parent.split(pattern).map((match) =>
        pattern.test(match)
          ? {
              element: transform?.(match, style, Array.from(match.matchAll(pattern))),
              match,
              style: style || parentStyle,
            }
          : { match, style: parentStyle },
      ),
    ),
    parsers,
    ++iteration,
  );
}
