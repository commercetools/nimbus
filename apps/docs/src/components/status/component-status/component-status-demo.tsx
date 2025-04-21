import React from "react";
import { Stack, Box, Heading, Text } from "@commercetools/nimbus";
import { ComponentStatus } from "./component-status";

export const ComponentStatusDemo: React.FC = () => {
  return (
    <Box>
      <Heading as="h2" mb="600">
        Component Status Display Demo
      </Heading>

      <Stack gap="800">
        <Box>
          <Heading as="h3" mb="400" fontSize="md">
            Normal Display (with labels and progress bar)
          </Heading>
          <Stack gap="300">
            <Heading as="h4" fontSize="sm">
              Missing Status
            </Heading>
            <ComponentStatus status={null} />

            <Heading as="h4" fontSize="sm">
              Experimental
            </Heading>
            <ComponentStatus status="Experimental" />

            <Heading as="h4" fontSize="sm">
              Alpha
            </Heading>
            <ComponentStatus status="Alpha" />

            <Heading as="h4" fontSize="sm">
              Beta
            </Heading>
            <ComponentStatus status="Beta" />

            <Heading as="h4" fontSize="sm">
              Release Candidate
            </Heading>
            <ComponentStatus status="ReleaseCandidate" />

            <Heading as="h4" fontSize="sm">
              Stable
            </Heading>
            <ComponentStatus status="Stable" />

            <Heading as="h4" fontSize="sm">
              Deprecated
            </Heading>
            <ComponentStatus status="Deprecated" />
          </Stack>
        </Box>

        <Box>
          <Heading as="h3" mb="400" fontSize="md">
            Compact Display (no labels, small size)
          </Heading>
          <Stack direction="horizontal" gap="400" alignItems="center">
            <ComponentStatus status={null} showLabel={false} size="sm" />
            <ComponentStatus
              status="Experimental"
              showLabel={false}
              size="sm"
            />
            <ComponentStatus status="Alpha" showLabel={false} size="sm" />
            <ComponentStatus status="Beta" showLabel={false} size="sm" />
            <ComponentStatus
              status="ReleaseCandidate"
              showLabel={false}
              size="sm"
            />
            <ComponentStatus status="Stable" showLabel={false} size="sm" />
            <ComponentStatus status="Deprecated" showLabel={false} size="sm" />
          </Stack>
        </Box>

        <Box>
          <Heading as="h3" mb="400" fontSize="md">
            Badge Only (no progress bar)
          </Heading>
          <Stack direction="horizontal" gap="400" alignItems="center">
            <ComponentStatus status={null} showProgressBar={false} />
            <ComponentStatus status="Experimental" showProgressBar={false} />
            <ComponentStatus status="Alpha" showProgressBar={false} />
            <ComponentStatus status="Beta" showProgressBar={false} />
            <ComponentStatus
              status="ReleaseCandidate"
              showProgressBar={false}
            />
            <ComponentStatus status="Stable" showProgressBar={false} />
            <ComponentStatus status="Deprecated" showProgressBar={false} />
          </Stack>
        </Box>

        <Box>
          <Heading as="h3" mb="400" fontSize="md">
            Large Size
          </Heading>
          <Stack gap="300">
            <ComponentStatus status="Beta" size="lg" />
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};
