import { gql } from 'graphql-request';

// eslint-disable-next-line import/prefer-default-export
export const endpoint = 'http://api.spacex.land/graphql/';

export const tableData = gql`
query ($find: LaunchFind) {
  launchesPastResult(find: $find) {
    data {
      links {
        mission_patch_small
        wikipedia
        video_link
        reddit_media
        reddit_recovery
        reddit_launch
        reddit_campaign
      }
      launch_site {
        site_name
      }
      rocket {
        rocket_name
        rocket {
          country
        }
      }
      launch_date_utc
      mission_name
      upcoming
    }
  }
}
`;

export const modalData = gql`
query ($find: LaunchFind) {
  launchesPastResult(find: $find){
    data {
      links {
        mission_patch_small
        wikipedia
        video_link
        reddit_media
        reddit_recovery
        reddit_launch
        reddit_campaign
        flickr_images
      }
      launch_site {
        site_name
      }
      rocket {
        rocket_name
        rocket {
          country
          active
          cost_per_launch
          mass {
            kg
            lb
          }
          diameter {
            feet
            meters
          }
          success_rate_pct
          description
        }
      }
      launch_date_utc
      mission_name
      upcoming
    }
  }
}
`;

export const Names = gql`
{
  launchesPastResult {
    data {
      rocket {
        rocket_name
      }
    }
  }
}
`;

export const MissionIds = gql`
{
  launchesPastResult {
    data {
      mission_id
    }
  }
}
`;

export const getMissions = gql`
query Query {
  missionsResult {
    data {
      name
      description
      manufacturers
      payloads {
        id
      }
      wikipedia
      twitter
      website
    }
  }
}
`;

export const payloadsPart1 = gql`
query ($find: MissionsFind) {
  missionsResult(find: $find) {
    data {
      payloads {
        customers
      }
    }
  }
}
`;

export const payloadsPart2 = gql`
query ($find: MissionsFind) {
  missionsResult(find: $find) {
    data {
      payloads {
        payload_mass_kg
        payload_mass_lbs
        payload_type
        reused
        orbit
        nationality
        manufacturer
      }
    }
  }
}
`;
